import React, { useState, useEffect } from 'react';
import { Upload, Github, Search, File, Folder, MessageSquare, Loader2, CheckCircle, XCircle } from 'lucide-react';

const CodeRAGApp = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [query, setQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // Form states
  const [repoUrl, setRepoUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [files, setFiles] = useState([]);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_BASE}/projects`);
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    
    if (selectedFiles.length === 0) return;

    setLoading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('project_name', projectName || 'uploaded_project');

      const response = await fetch(`${API_BASE}/upload-folder`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: `Successfully processed ${data.chunks_processed} code chunks`
        });
        fetchProjects();
      } else {
        setUploadStatus({
          type: 'error',
          message: data.error || 'Upload failed'
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRepoUpload = async () => {
    if (!repoUrl) return;

    setLoading(true);
    setUploadStatus(null);

    try {
      const response = await fetch(`${API_BASE}/upload-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_url: repoUrl,
          project_name: projectName || 'git_project'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: `Successfully processed ${data.chunks_processed} code chunks from repository`
        });
        fetchProjects();
      } else {
        setUploadStatus({
          type: 'error',
          message: data.error || 'Repository upload failed'
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Network error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query || !selectedProject) return;

    setQueryLoading(true);
    setQueryResults(null);

    try {
      const response = await fetch(`${API_BASE}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          project_name: selectedProject
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setQueryResults(data);
      } else {
        setQueryResults({
          error: data.error || 'Query failed'
        });
      }
    } catch (error) {
      setQueryResults({
        error: 'Network error occurred'
      });
    } finally {
      setQueryLoading(false);
    }
  };

  const StatusMessage = ({ status }) => {
    if (!status) return null;
    
    const isSuccess = status.type === 'success';
    const Icon = isSuccess ? CheckCircle : XCircle;
    const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
    const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
    const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`p-4 rounded-lg ${bgColor} flex items-center gap-2`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <span className={textColor}>{status.message}</span>
      </div>
    );
  };

  const CodeChunk = ({ chunk }) => (
    <div className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
        <File className="w-4 h-4" />
        <span>{chunk.metadata.file_path}</span>
        <span>Lines: {chunk.metadata.start_line}-{chunk.metadata.end_line}</span>
      </div>
      <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
        <code>{chunk.content}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Code RAG Assistant</h1>
            <p className="text-blue-100">Upload your code and ask questions about it</p>
          </div>

          {/* Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'upload'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="w-5 h-5 inline mr-2" />
                Upload Code
              </button>
              <button
                onClick={() => setActiveTab('query')}
                className={`px-6 py-3 font-medium ${
                  activeTab === 'query'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Search className="w-5 h-5 inline mr-2" />
                Query Code
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'upload' && (
              <div className="space-y-8">
                {/* Folder Upload */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Folder className="w-5 h-5" />
                    Upload Folder
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Files
                      </label>
                      <input
                        type="file"
                        multiple
                        webkitdirectory=""
                        onChange={handleFileUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {files.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Selected {files.length} files
                      </div>
                    )}
                  </div>
                </div>

                {/* Git Repository Upload */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    Clone Git Repository
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Repository URL
                      </label>
                      <input
                        type="url"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://github.com/user/repo.git"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter project name"
                      />
                    </div>
                    <button
                      onClick={handleRepoUpload}
                      disabled={loading || !repoUrl}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Clone Repository'
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Message */}
                <StatusMessage status={uploadStatus} />
              </div>
            )}

            {activeTab === 'query' && (
              <div className="space-y-6">
                {/* Query Interface */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Ask About Your Code
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Project
                      </label>
                      <select
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Choose a project</option>
                        {projects.map(project => (
                          <option key={project} value={project}>
                            {project.replace('code_project_', '')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Question
                      </label>
                      <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Ask anything about your code..."
                      />
                    </div>
                    <button
                      onClick={handleQuery}
                      disabled={queryLoading || !query || !selectedProject}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {queryLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        'Ask Question'
                      )}
                    </button>
                  </div>
                </div>

                {/* Query Results */}
                {queryResults && (
                  <div className="bg-white rounded-lg border shadow-sm">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="font-semibold text-gray-900">Response</h3>
                    </div>
                    <div className="p-4">
                      {queryResults.error ? (
                        <div className="text-red-600">{queryResults.error}</div>
                      ) : (
                        <div className="space-y-4">
                          <div className="prose max-w-none">
                            <p className="text-gray-900 whitespace-pre-wrap">
                              {queryResults.response}
                            </p>
                          </div>
                          
                          {queryResults.relevant_chunks && queryResults.relevant_chunks.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Relevant Code Sections:
                              </h4>
                              {queryResults.relevant_chunks.map((chunk, index) => (
                                <CodeChunk key={index} chunk={chunk} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeRAGApp;