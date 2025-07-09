from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import shutil
import subprocess
from pathlib import Path
import hashlib
from typing import List, Dict, Any
import chromadb
from chromadb.utils import embedding_functions
import openai
from werkzeug.utils import secure_filename
import zipfile
import git
import fnmatch

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'.py', '.js', '.ts', '.java', '.cpp', '.c', '.cs', '.go', '.rb', '.php', '.swift', '.kt', '.rs', '.scala', '.sh', '.sql', '.html', '.css', '.json', '.xml', '.yaml', '.yml', '.md', '.txt'}
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# Initialize ChromaDB
chroma_client = chromadb.PersistentClient(path="./chroma_db")
embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key=OPENAI_API_KEY,
    model_name="text-embedding-ada-002"
)

# Initialize OpenAI
openai.api_key = OPENAI_API_KEY

class CodeRAGProcessor:
    def __init__(self):
        self.collection = None
        self.current_project = None
        
    def create_or_get_collection(self, project_name: str):
        """Create or get a collection for the project"""
        collection_name = f"code_project_{hashlib.md5(project_name.encode()).hexdigest()[:8]}"
        try:
            self.collection = chroma_client.get_collection(
                name=collection_name,
                embedding_function=embedding_function
            )
        except:
            self.collection = chroma_client.create_collection(
                name=collection_name,
                embedding_function=embedding_function
            )
        self.current_project = project_name
        return self.collection
    
    def is_code_file(self, file_path: str) -> bool:
        """Check if file is a code file based on extension"""
        return Path(file_path).suffix.lower() in ALLOWED_EXTENSIONS
    
    def should_ignore_file(self, file_path: str) -> bool:
        """Check if file should be ignored (based on common ignore patterns)"""
        ignore_patterns = [
            '*.pyc', '__pycache__', '.git', '.gitignore', 'node_modules',
            '.env', '.venv', 'venv', '.DS_Store', '*.log', '.pytest_cache',
            'dist', 'build', '.idea', '.vscode', '*.egg-info'
        ]
        
        file_name = os.path.basename(file_path)
        dir_name = os.path.dirname(file_path)
        
        for pattern in ignore_patterns:
            if fnmatch.fnmatch(file_name, pattern) or pattern in dir_name:
                return True
        return False
    
    def extract_code_chunks(self, file_path: str, content: str) -> List[Dict]:
        """Extract meaningful code chunks from file content"""
        chunks = []
        lines = content.split('\n')
        
        # Simple chunking strategy - can be improved
        current_chunk = []
        chunk_size = 50  # lines per chunk
        overlap = 10     # overlapping lines
        
        for i in range(0, len(lines), chunk_size - overlap):
            chunk_lines = lines[i:i + chunk_size]
            chunk_content = '\n'.join(chunk_lines)
            
            if chunk_content.strip():
                chunks.append({
                    'content': chunk_content,
                    'file_path': file_path,
                    'start_line': i + 1,
                    'end_line': min(i + chunk_size, len(lines))
                })
        
        return chunks
    
    def process_file(self, file_path: str) -> List[Dict]:
        """Process a single file and extract chunks"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            if not content.strip():
                return []
            
            chunks = self.extract_code_chunks(file_path, content)
            return chunks
            
        except Exception as e:
            print(f"Error processing file {file_path}: {str(e)}")
            return []
    
    def process_directory(self, directory_path: str) -> List[Dict]:
        """Process all code files in a directory"""
        all_chunks = []
        
        for root, dirs, files in os.walk(directory_path):
            # Skip hidden directories and common ignore patterns
            dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', '__pycache__', '.git']]
            
            for file in files:
                file_path = os.path.join(root, file)
                
                if self.is_code_file(file_path) and not self.should_ignore_file(file_path):
                    chunks = self.process_file(file_path)
                    all_chunks.extend(chunks)
        
        return all_chunks
    
    def clone_repository(self, repo_url: str, temp_dir: str) -> str:
        """Clone a Git repository to temporary directory"""
        try:
            repo = git.Repo.clone_from(repo_url, temp_dir)
            return temp_dir
        except Exception as e:
            raise Exception(f"Failed to clone repository: {str(e)}")
    
    def add_to_vector_store(self, chunks: List[Dict], project_name: str):
        """Add code chunks to vector store"""
        if not chunks:
            return
        
        self.create_or_get_collection(project_name)
        
        documents = []
        metadatas = []
        ids = []
        
        for i, chunk in enumerate(chunks):
            # Create document text with context
            doc_text = f"File: {chunk['file_path']}\nLines: {chunk['start_line']}-{chunk['end_line']}\n\n{chunk['content']}"
            documents.append(doc_text)
            
            metadatas.append({
                'file_path': chunk['file_path'],
                'start_line': chunk['start_line'],
                'end_line': chunk['end_line'],
                'project': project_name
            })
            
            ids.append(f"{project_name}_{i}")
        
        # Add to ChromaDB in batches
        batch_size = 100
        for i in range(0, len(documents), batch_size):
            batch_docs = documents[i:i + batch_size]
            batch_metadata = metadatas[i:i + batch_size]
            batch_ids = ids[i:i + batch_size]
            
            self.collection.add(
                documents=batch_docs,
                metadatas=batch_metadata,
                ids=batch_ids
            )
    
    def query_code(self, query: str, project_name: str, top_k: int = 5) -> List[Dict]:
        """Query the code vector store"""
        self.create_or_get_collection(project_name)
        
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        
        formatted_results = []
        if results['documents']:
            for i, doc in enumerate(results['documents'][0]):
                formatted_results.append({
                    'content': doc,
                    'metadata': results['metadatas'][0][i],
                    'distance': results['distances'][0][i] if results['distances'] else None
                })
        
        return formatted_results
    
    def generate_response(self, query: str, context_chunks: List[Dict]) -> str:
        """Generate response using OpenAI with retrieved context"""
        context = "\n\n".join([chunk['content'] for chunk in context_chunks])
        
        prompt = f"""
You are a code assistant. Based on the following code context, answer the user's question.

Context:
{context}

Question: {query}

Please provide a helpful and accurate response based on the code context provided.
"""
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful code assistant."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating response: {str(e)}"

# Initialize processor
processor = CodeRAGProcessor()

@app.route('/api/upload-folder', methods=['POST'])
def upload_folder():
    """Handle folder upload"""
    try:
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        project_name = request.form.get('project_name', 'uploaded_project')
        
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Save uploaded files
            for file in files:
                if file.filename:
                    # Maintain directory structure
                    file_path = os.path.join(temp_dir, secure_filename(file.filename))
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    file.save(file_path)
            
            # Process the directory
            chunks = processor.process_directory(temp_dir)
            processor.add_to_vector_store(chunks, project_name)
            
            return jsonify({
                'message': 'Folder processed successfully',
                'chunks_processed': len(chunks),
                'project_name': project_name
            })
            
        finally:
            shutil.rmtree(temp_dir)
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload-repo', methods=['POST'])
def upload_repo():
    """Handle Git repository upload"""
    try:
        data = request.json
        repo_url = data.get('repo_url')
        project_name = data.get('project_name', 'git_project')
        
        if not repo_url:
            return jsonify({'error': 'Repository URL is required'}), 400
        
        # Create temporary directory
        temp_dir = tempfile.mkdtemp()
        
        try:
            # Clone repository
            processor.clone_repository(repo_url, temp_dir)
            
            # Process the cloned repository
            chunks = processor.process_directory(temp_dir)
            processor.add_to_vector_store(chunks, project_name)
            
            return jsonify({
                'message': 'Repository processed successfully',
                'chunks_processed': len(chunks),
                'project_name': project_name,
                'repo_url': repo_url
            })
            
        finally:
            shutil.rmtree(temp_dir)
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/query', methods=['POST'])
def query_code():
    """Handle code queries"""
    try:
        data = request.json
        query = data.get('query')
        project_name = data.get('project_name')
        
        if not query or not project_name:
            return jsonify({'error': 'Query and project name are required'}), 400
        
        # Retrieve relevant chunks
        relevant_chunks = processor.query_code(query, project_name)
        
        # Generate response
        response = processor.generate_response(query, relevant_chunks)
        
        return jsonify({
            'response': response,
            'relevant_chunks': relevant_chunks[:3],  # Return top 3 chunks
            'total_chunks_found': len(relevant_chunks)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Get list of available projects"""
    try:
        collections = chroma_client.list_collections()
        projects = [col.name for col in collections if col.name.startswith('code_project_')]
        return jsonify({'projects': projects})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True, host='0.0.0.0', port=5000)