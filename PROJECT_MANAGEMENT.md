# 📁 Project Management System

This document explains how to manage projects in your portfolio using the structured content system.

## 🚀 Quick Start

### Adding a New Project

1. **Use the interactive script:**

   ```bash
   npm run create-project
   ```

2. **Or create manually:**

   - Create a new `.md` file in `/content/projects/`
   - Use the template below
   - Add project image to `/content/projects/`

3. **Build the static data:**
   ```bash
   npm run build-projects
   ```

### Listing All Projects

```bash
npm run list-projects
```

### Development Workflow

1. **Edit projects** in `/content/projects/*.md`
2. **Build static data**: `npm run build-projects`
3. **Start development**: `npm run dev`
4. **Build for production**: `npm run build` (automatically builds projects)

## 📋 Project Structure

Each project is a Markdown file with frontmatter metadata:

```markdown
---
title: "Project Title"
description: "Short description"
imageUrl: "/content/projects/project-name.jpg"
tags: ["Tag1", "Tag2", "Tag3"]
technologies:
  - category: "ai"
    name: "Python"
  - category: "frontend"
    name: "React"
links:
  live: "https://project-demo.com"
  github: "https://github.com/username/project"
  caseStudy: "/projects/project-name"
status: "completed" # completed, in-progress, archived
featured: true
date:
  start: "2023-01-01"
  end: "2023-06-30"
metrics:
  performance: "94% accuracy"
  impact: "Reduced processing time by 60%"
  scale: "Processed 1M+ records"
challenges:
  - "Challenge 1"
  - "Challenge 2"
solutions:
  - "Solution 1"
  - "Solution 2"
learnings:
  - "Learning 1"
  - "Learning 2"
---

## Project Overview

Detailed project description here...

## Technical Implementation

### Key Features

- Feature 1
- Feature 2

### Technologies Used

- Technology 1
- Technology 2

## Results and Impact

### Performance Metrics

- Metric 1
- Metric 2

### Business Impact

- Impact 1
- Impact 2

## Future Enhancements

- Enhancement 1
- Enhancement 2
```

## 🏷️ Technology Categories

- **ai**: Artificial Intelligence, Machine Learning, Deep Learning
- **frontend**: React, Vue, Angular, HTML/CSS, UI/UX
- **backend**: Node.js, Python, APIs, Databases, Server-side
- **devops**: AWS, Docker, CI/CD, Infrastructure, Deployment
- **data**: Data Science, Analytics, Visualization, ETL

## 📊 Project Status

- **completed**: Finished projects
- **in-progress**: Currently working on
- **archived**: Old or deprecated projects

## 🎯 Featured Projects

Set `featured: true` to highlight important projects on the homepage.

## 📁 File Organization

```
content/
├── projects/
│   ├── project-1.md
│   ├── project-2.md
│   └── project-images/
│       ├── project-1.jpg
│       └── project-2.jpg
├── headshot/
│   └── Me.jpeg
└── resume/
    └── AIML_Resume_WintonGee.pdf
```

## 🔧 Available Scripts

- `npm run create-project` - Interactive project creation
- `npm run list-projects` - List all projects with details
- `npm run build-projects` - Build static JSON from markdown files
- `npm run generate-embeddings` - Update AI embeddings

## 📝 Best Practices

### Project Images

- Use high-quality images (1200x800px recommended)
- Save as `.jpg` or `.png`
- Place in `/content/projects/` directory
- Name files consistently: `project-slug.jpg`

### Content Writing

- Write clear, concise descriptions
- Include specific metrics and results
- Highlight challenges and solutions
- Use consistent formatting

### Technology Tags

- Use specific technology names
- Categorize correctly (ai, frontend, backend, devops, data)
- Include both primary and secondary technologies

### Links

- Always include GitHub link if available
- Add live demo URL when applicable
- Use case study links for detailed project pages

## 🚀 Advanced Features

### Filtering Projects

```typescript
import { filterProjects } from "@/lib/content";

// Get AI projects
const aiProjects = filterProjects({ category: "ai" });

// Get featured projects
const featured = filterProjects({ featured: true });

// Get completed projects
const completed = filterProjects({ status: "completed" });
```

### Getting Related Projects

```typescript
import { getRelatedProjects } from "@/lib/content";

const related = getRelatedProjects(currentProject, 3);
```

### Project Categories

```typescript
import { getProjectCategories } from "@/lib/content";

const categories = getProjectCategories();
```

## 🔄 Migration from Old System

If you have existing projects in components, you can migrate them:

1. Extract project data from component files
2. Create corresponding `.md` files in `/content/projects/`
3. Update components to use `getAllProjects()`
4. Test the new system

## 🐛 Troubleshooting

### Common Issues

1. **Projects not showing**: Check file format and frontmatter
2. **Images not loading**: Verify image paths and file existence
3. **Build errors**: Ensure all required fields are present
4. **Type errors**: Check TypeScript interfaces match your data

### Debug Commands

```bash
# Check project files
ls -la content/projects/

# Validate project structure
npm run list-projects

# Check for missing images
find content/projects/ -name "*.jpg" -o -name "*.png"
```

## 📈 Analytics and Insights

The system automatically tracks:

- Project count by category
- Featured vs regular projects
- Technology usage across projects
- Project completion rates
- Timeline analysis

Use `npm run list-projects` to see these insights.
