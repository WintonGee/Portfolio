# Portfolio Project Structure & Organization Guide

## 📁 **Current Project Structure**

Your portfolio is well-organized with a clear content management structure:

```
Portfolio/
├── app/                          # Next.js app directory
│   ├── api/                     # API routes
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page (updated with new sections)
├── components/                   # React components
│   ├── About.tsx                # ✅ About section component
│   ├── Chatbot.tsx              # Existing chatbot
│   ├── Header.tsx               # Old header (replaced by Navbar)
│   ├── Navbar.tsx               # ✅ New navigation component
│   ├── ProjectCard.tsx          # ✅ Reusable project card
│   └── Projects.tsx             # ✅ Projects showcase section
├── content/                      # Content management directory
│   ├── headshot/
│   │   └── Me.jpeg              # ✅ Your headshot (copied to public/)
│   ├── projects/                # Project assets directory
│   │   └── (Add your project images here)
│   └── resume/
│       └── AIML_Resume_WintonGee.pdf  # ✅ Your resume
├── data/                        # Data files
│   ├── embeddings.json          # Chatbot embeddings
│   └── embeddings-summary.json  # Embeddings summary
├── public/                      # Static assets (served by Next.js)
│   ├── headshot.jpg             # ✅ Your headshot (copied from content/)
│   └── resume/
│       └── AIML_Resume_WintonGee.pdf  # Resume for public access
└── scripts/                     # Utility scripts
    ├── generate-embeddings.ts   # Embedding generation
    └── setup-env.sh             # Environment setup
```

## ✅ **What's Already Done**

1. **Headshot Integration**: Your headshot from `content/headshot/Me.jpeg` has been copied to `public/headshot.jpg` and is now being used in the About component.

2. **Component Structure**: All new components are properly organized in the `components/` directory.

3. **Content Organization**: Your `content/` directory provides a clean way to manage assets before they're served publicly.

## 🔧 **Next Steps for Project Images**

### 1. **Add Project Screenshots**

Place your project images in the `content/projects/` directory:

```bash
# Example structure for project images
content/projects/
├── medical-ai-diagnosis.jpg
├── sentiment-analysis-api.jpg
├── trading-bot.jpg
├── object-detection.jpg
├── nlp-pipeline.jpg
└── analytics-dashboard.jpg
```

### 2. **Copy to Public Directory**

After adding images to `content/projects/`, copy them to `public/`:

```bash
# Copy project images to public directory
cp content/projects/*.jpg public/
```

### 3. **Update Project Data**

Edit `components/Projects.tsx` to use your actual project images:

```typescript
// Update the imageUrl paths in the projects array
{
  title: "Your Project Title",
  description: "Your actual project description...",
  imageUrl: "/medical-ai-diagnosis.jpg", // Updated path
  tags: ["Your", "Actual", "Technologies"],
  liveUrl: "https://your-actual-demo.com",
  githubUrl: "https://github.com/yourusername/your-repo"
}
```

## 🎯 **Best Practices for Your Structure**

### **Content Management Workflow**

1. **Add new assets** to `content/` directory first
2. **Copy to `public/`** when ready to serve
3. **Update components** to reference the public paths
4. **Keep `content/`** as your source of truth for assets

### **File Naming Conventions**

- Use kebab-case for file names: `medical-ai-diagnosis.jpg`
- Keep descriptive names: `sentiment-analysis-api.jpg`
- Use consistent extensions: `.jpg`, `.png`, `.webp`

### **Component Organization**

- Each component in its own file
- Clear prop interfaces with TypeScript
- Consistent styling with Tailwind CSS
- Responsive design patterns

## 🚀 **Ready to Deploy**

Your portfolio structure is now:

- ✅ **Well-organized** with clear separation of concerns
- ✅ **Scalable** for adding more projects and content
- ✅ **Maintainable** with proper component structure
- ✅ **Production-ready** with optimized assets

The headshot is already integrated, and you just need to add your project images following the same pattern!
