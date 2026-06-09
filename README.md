# AI-Powered Portfolio Website - Winton Gee

🌐 **Live Portfolio:** [wintongee.com](https://wintongee.com)

A modern, interactive portfolio showcasing AI/ML engineering skills with a real-time RAG chatbot, interactive skill demonstrations, and advanced animations. **Fully Cloudflare-powered**: Next.js 15 on Cloudflare Workers (OpenNext), with all content editable live from a Cloudflare Access–gated dashboard — no rebuild required.

## ✨ Key Features

### 🤖 **AI-Powered Chatbot (RAG)**

- **Cloudflare Vectorize**: real vector search over the knowledge base (768-dim, cosine)
- **Workers AI**: embeddings via `@cf/baai/bge-base-en-v1.5`, chat via `@cf/meta/llama-3.1-8b-instruct-fast` (streaming)
- **D1-backed knowledge**: source docs live in D1; editing a doc re-embeds into Vectorize instantly
- **Source citations**: answers cite the knowledge docs they drew from

### 🔐 **Admin Dashboard** (`/dashboard`)

- **Gated by Cloudflare Access (Zero Trust)** — only `wintongee@gmail.com`, with server-side JWT verification as defense-in-depth
- Edit **chatbot knowledge**, **site content** (about/skills/timeline), **projects**, and upload a new **resume PDF**
- All changes persist to Cloudflare storage and go live without a deploy

### 🎯 **Interactive Skill Demonstrations**

- **Hover Cards**: Show exactly where each technology was used in real projects
- **Dynamic Content**: Real-time skill usage tracking
- **Visual Learning**: Interactive way to understand technical expertise

### 🚀 **Modern Tech Stack**

- **Next.js 15** (App Router) on **Cloudflare Workers** via OpenNext
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Advanced animations and micro-interactions
- **Cloudflare**: Workers AI (LLM + embeddings), Vectorize, D1, R2, Access

### 📱 **Responsive Design**

- **Mobile-First**: Optimized for all device sizes
- **Performance**: Lighthouse scores 90+ across all metrics
- **Accessibility**: WCAG compliant with proper semantic HTML

## 🏗️ Architecture Overview

### **AI Chatbot System (runtime RAG)**

```
User Question → Workers AI embed → Vectorize query (topK) → D1 fetch docs → Llama 3.1 → Streaming Response
```

### **Content storage (Cloudflare-native)**

| Concern | Where it lives | Binding |
| --- | --- | --- |
| Chatbot knowledge (source text) | **D1** `knowledge_docs` | `DB` |
| Chatbot knowledge (vectors) | **Vectorize** `portfolio-knowledge` | `VECTORIZE` |
| Site content (about/skills/timeline) | **D1** `content_blocks` | `DB` |
| Projects (card + case study) | **D1** `projects` | `DB` |
| Resume PDF | **R2** `portfolio-assets` | `ASSETS_BUCKET` |

### **Admin auth**

A self-hosted **Cloudflare Access** application gates `/dashboard` and `/api/admin/*` to
`wintongee@gmail.com`. Every admin handler also calls `requireAdmin()`, which verifies the
`Cf-Access-Jwt-Assertion` JWT (RS256 against the team JWKS), the `aud`, and the email claim —
so writes are rejected even if a route were reached directly. Local dev bypasses this via
`ENVIRONMENT=development`. Editing knowledge re-embeds into Vectorize on save (no rebuild).

To run admin routes against real bindings locally (Vectorize has no local emulation):

```
npx opennextjs-cloudflare build
npx wrangler dev --remote --port 8799 --var ENVIRONMENT:development
```

### **Component Architecture**

- **Hero Section**: Animated introduction with gradient backgrounds
- **About Section**: Interactive skill cards with hover effects
- **Projects Section**: Dynamic project showcase with case studies
- **Chatbot Interface**: Real-time AI conversation with source citations
- **Collaboration CTA**: Professional contact section with animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key

### Quick Start

1. **Clone the repository:**

```bash
git clone https://github.com/WintonGee/Portfolio.git
cd Portfolio
```

2. **Complete setup:**

```bash
make quick-start
```

3. **Start development:**

```bash
make dev
```

4. **Open [http://localhost:3000](http://localhost:3000)**

### Manual Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment:**

```bash
make setup-env
# or manually create .env.local with your Gemini API key
```

3. **Generate embeddings:**

```bash
make generate-embeddings
```

4. **Start development server:**

```bash
npm run dev
```

## 📁 Project Structure

```
Portfolio/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── chat/                 # AI chatbot endpoint
│   │   └── chatbot-sources/      # Content management API
│   ├── projects/[slug]/         # Dynamic project pages
│   ├── chatbot-sources/         # Chatbot content viewer
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # React components
│   ├── Chatbot.tsx              # AI chatbot interface
│   ├── Hero.tsx                 # Animated hero section
│   ├── About.tsx                # Interactive about section
│   ├── ProjectsNew.tsx          # Project showcase
│   ├── CollaborationCTA.tsx    # Contact section
│   ├── EducationTimeline.tsx    # Education timeline
│   ├── FloatingChatButton.tsx   # Chat toggle button
│   └── ui/                      # Reusable UI components
│       ├── AnimatedSection.tsx  # Animation wrapper
│       ├── Button.tsx           # Custom button component
│       └── SkillHoverCard.tsx   # Interactive skill cards
├── data/                        # Content and data
│   ├── chatbot/                 # Chatbot content files
│   │   ├── personal/           # Personal information
│   │   ├── professional/       # Professional experience
│   │   ├── skills/             # Technical skills
│   │   └── contact/            # Contact information
│   ├── projects.json          # Project data
│   ├── skills-data.ts          # Skills configuration
│   ├── timeline-data.ts        # Timeline data
│   └── chatbot-embeddings.json # Generated embeddings
├── lib/                         # Utilities and generated files
│   └── embeddings.ts           # Build-time embedded data
├── scripts/                     # Build and utility scripts
│   ├── embed-embeddings.js     # Build-time embedding script
│   ├── generate-chatbot-embeddings.js # Embeddings generation
│   ├── optimize-images.js      # Image optimization
│   └── setup-env.sh           # Environment setup
├── public/                      # Static assets
│   ├── images/                 # Project images
│   ├── logos/                  # Company and tech logos
│   └── chatbot-embeddings.json # Public embeddings copy
├── types/                       # TypeScript definitions
├── hooks/                       # Custom React hooks
├── Makefile                    # Project management commands
└── next.config.mjs             # Next.js configuration
```

## 🤖 AI Chatbot System

### **How It Works**

1. **Content Processing**: Portfolio content is converted to vector embeddings
2. **Build-Time Embedding**: Embeddings are compiled into TypeScript code
3. **Semantic Search**: User questions are matched against content using cosine similarity
4. **Context Retrieval**: Most relevant content is retrieved and sent to Gemini
5. **AI Response**: Gemini generates contextual responses based on portfolio data

### **Key Features**

- **RAG Implementation**: Retrieval-Augmented Generation for accurate responses
- **Streaming Responses**: Real-time word-by-word AI responses
- **Source Citations**: Shows which content sources were used
- **Context Awareness**: Answers based on actual portfolio content
- **Error Handling**: Graceful fallbacks for API failures

### **Content Management**

The chatbot uses structured content files in `data/chatbot/`:

- **Personal**: Basic info, education, contact details
- **Professional**: Work experience, projects, achievements
- **Skills**: Technical skills and expertise areas
- **Contact**: Availability and contact preferences

## 🛠️ Development Commands

### **Setup Commands**

```bash
make help              # Show all available commands
make quick-start       # Complete setup (env + install + embeddings)
make setup            # Install dependencies and setup environment
make setup-env        # Set up environment variables
make install          # Install npm dependencies
```

### **Development Commands**

```bash
make dev              # Start development server
make build            # Build for production
make start            # Start production server
make lint             # Run ESLint
make lint-fix         # Run ESLint with auto-fix
```

### **AI & Content Commands**

```bash
make generate-embeddings  # Generate embeddings from content
make test-chat           # Test the chatbot API
make new-project NAME="my-project"  # Create new project file
```

### **Performance Commands**

```bash
make optimize-images  # Optimize images to WebP/AVIF
make analyze-bundle   # Analyze bundle size
make lighthouse      # Run Lighthouse audit
make perf-test       # Complete performance test suite
```

### **Utility Commands**

```bash
make clean            # Clean all build artifacts
make clean-data       # Clean only data files
make status           # Show project status
make rebuild          # Clean rebuild of entire project
```

## 🎨 Customization

### **Adding Projects**

1. **Create project data** in `data/projects.json`
2. **Add project content** in `data/chatbot/professional/`
3. **Create case study** in `app/projects/[slug]/`
4. **Regenerate embeddings**: `make generate-embeddings`

### **Styling**

The project uses a custom design system with Tailwind CSS:

- **Colors**: Defined in `tailwind.config.ts`
- **Components**: Reusable components in `components/ui/`
- **Animations**: Framer Motion animations throughout
- **Responsive**: Mobile-first design approach

### **AI Chatbot Content**

To update chatbot responses:

1. **Edit content files** in `data/chatbot/`
2. **Regenerate embeddings**: `make generate-embeddings`
3. **Test responses**: `make test-chat`

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect repository** to Vercel
2. **Add environment variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key
3. **Deploy**: Automatic deployment on push to main

### **Build Process**

The deployment uses a sophisticated build process:

1. **Embeddings Generation**: Content is converted to embeddings
2. **Build-Time Embedding**: Embeddings are compiled into TypeScript
3. **Next.js Build**: Application is built with embedded data
4. **Vercel Deployment**: Optimized bundle is deployed

### **Environment Variables**

Required for production:

- `GEMINI_API_KEY`: Google Gemini API key for AI responses

## 📊 Performance Features

- **Next.js SSR**: Server-side rendering for optimal performance
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Bundle Optimization**: Tree shaking and code splitting
- **Caching**: Strategic caching for API responses
- **Lighthouse**: 90+ scores across all metrics

## 🔧 Technical Highlights

### **AI Integration**

- **Google Gemini AI**: Latest model for intelligent responses
- **Vector Embeddings**: Semantic search with cosine similarity
- **Streaming**: Real-time response streaming
- **Error Handling**: Robust error handling and fallbacks

### **Modern Web Technologies**

- **Next.js 14**: Latest App Router with SSR
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Advanced animations
- **React 18**: Latest React features

### **Performance Optimizations**

- **Build-Time Embedding**: No runtime file I/O
- **Image Optimization**: Automatic format conversion
- **Bundle Splitting**: Optimized loading
- **Caching**: Strategic response caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly: `make test-chat`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you have questions or need help:

- **GitHub Issues**: Open an issue for bugs or feature requests
- **Email**: wintongee@gmail.com
- **LinkedIn**: [linkedin.com/in/wintongee](https://linkedin.com/in/wintongee)

---

**Built with ❤️ by Winton Gee using Next.js, TypeScript, and AI**
