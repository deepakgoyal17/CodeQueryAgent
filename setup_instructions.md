# Code RAG Application Setup Guide

## Overview
This application allows you to upload code (folders or Git repositories) and query it using natural language through a Retrieval-Augmented Generation (RAG) system.

## Prerequisites

### Required Software
- Python 3.8+
- Node.js 16+
- Git

### API Keys
- OpenAI API Key (for embeddings and chat completion)

## Backend Setup

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=