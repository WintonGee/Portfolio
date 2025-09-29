#!/bin/bash

# Portfolio Website Environment Setup Script
# This script sets up the environment variables for the portfolio website

echo "🚀 Setting up Portfolio Website Environment..."

# Check if .env.local already exists
if [ -f .env.local ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local with Gemini API key
echo "GEMINI_API_KEY=AIzaSyCIV6PKQ3rXSDR6jd70U2txZgHP3iGL53M" > .env.local

echo "✅ Environment variables set up successfully!"
echo ""
echo "📋 Environment variables created:"
echo "   - GEMINI_API_KEY: [CONFIGURED]"
echo ""
echo "🔒 Security Note:"
echo "   - .env.local is in .gitignore and won't be committed"
echo "   - Keep your API keys secure and never share them publicly"
echo ""
echo "🎯 Next steps:"
echo "   1. Run 'npm install' to install dependencies"
echo "   2. Run 'npm run generate-embeddings' to create embeddings"
echo "   3. Run 'npm run dev' to start development server"
