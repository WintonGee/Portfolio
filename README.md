# Portfolio Website - Winton Gee

🌐 **Live Portfolio:** [wintongee.com](https://wintongee.com)

A modern, AI-powered portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Next.js 14** with App Router
- 💎 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🤖 **AI Chatbot** with RAG capabilities
- 📱 **Responsive Design** for all devices
- 🌙 **Dark Mode** support
- 📝 **MDX Content** management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key

### Quick Start

1. Clone the repository:

```bash
git clone <your-repo-url>
cd portfolio-website
```

2. Set up environment and install dependencies:

```bash
make quick-start
```

3. Start the development server:

```bash
make dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual Setup

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
make setup-env
# or manually create .env.local with your Gemini API key
```

3. Generate embeddings:

```bash
make generate-embeddings
```

4. Run the development server:

```bash
npm run dev
```

## Project Structure

```
portfolio-website/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/          # Chatbot API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Chatbot.tsx        # AI chatbot component
│   ├── Header.tsx         # Navigation header
│   └── ProjectCard.tsx    # Project display card
├── content/               # MDX content files
│   └── projects/          # Project documentation
├── scripts/               # Utility scripts
│   ├── generate-embeddings.ts  # Embeddings generation script
│   └── setup-env.sh      # Environment setup script
├── data/                  # Generated data files (gitignored)
│   ├── embeddings.json    # Portfolio embeddings
│   └── embeddings-summary.json  # Embeddings metadata
├── public/                # Static assets
├── Makefile              # Project management commands
└── ...config files
```

## Customization

### Adding Projects

1. Create a new MDX file in `content/projects/`
2. Add frontmatter with project details:

```yaml
---
title: "Project Name"
description: "Project description"
tags: ["tag1", "tag2"]
date: "2024-01-01"
featured: true
liveUrl: "https://example.com"
githubUrl: "https://github.com/username/repo"
---
```

### Styling

The project uses Tailwind CSS. You can customize:

- Colors in `tailwind.config.ts`
- Global styles in `app/globals.css`
- Component-specific styles using Tailwind classes

### AI Chatbot

The chatbot uses Google Gemini API with RAG (Retrieval-Augmented Generation) for intelligent responses. It's already configured with your API key.

#### Features:

- **RAG Implementation**: Uses embeddings to find relevant portfolio content
- **Streaming Responses**: Real-time word-by-word responses
- **Context-Aware**: Answers based on your actual portfolio content
- **Semantic Search**: Finds relevant information using vector similarity

#### How it works:

1. Your portfolio content is converted to embeddings using Gemini's text-embedding-004 model
2. User questions are also converted to embeddings
3. The system finds the most relevant content using cosine similarity
4. Gemini generates responses based on the retrieved context

#### Managing Embeddings:

```bash
# Generate embeddings from your content
make generate-embeddings

# Clean and regenerate embeddings
make clean-data && make generate-embeddings
```

## Makefile Commands

The project includes a comprehensive Makefile for easy project management:

### Setup Commands

```bash
make help              # Show all available commands
make quick-start       # Complete setup (env + install + embeddings)
make setup            # Install dependencies and setup environment
make setup-env        # Set up environment variables
make install          # Install npm dependencies
```

### Development Commands

```bash
make dev              # Start development server
make build            # Build for production
make start            # Start production server
make lint             # Run ESLint
make lint-fix         # Run ESLint with auto-fix
```

### AI & Content Commands

```bash
make generate-embeddings  # Generate embeddings from content
make test-chat           # Test the chatbot API
make new-project NAME="my-project"  # Create new project file
```

### Utility Commands

```bash
make clean            # Clean all build artifacts
make clean-data       # Clean only data files
make status           # Show project status
make rebuild          # Clean rebuild of entire project
```

### Deployment Commands

```bash
make deploy-vercel    # Deploy to Vercel
make deploy-netlify   # Deploy to Netlify
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help, please open an issue on GitHub.
