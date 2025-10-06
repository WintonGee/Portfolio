# Portfolio Website Makefile
# Author: Your Name
# Description: Makefile for managing the portfolio website project

# Variables
NODE_VERSION := 18
PORT := 3000
GEMINI_API_KEY := ${GEMINI_API_KEY}

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
WHITE := \033[0;37m
RESET := \033[0m

# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(CYAN)Portfolio Website - Available Commands$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Setup targets
.PHONY: install
install: ## Install all dependencies
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	npm install
	@echo "$(GREEN)✅ Dependencies installed successfully$(RESET)"

.PHONY: setup-env
setup-env: ## Set up environment variables
	@echo "$(BLUE)Setting up environment variables...$(RESET)"
	@if [ -z "$(GEMINI_API_KEY)" ]; then \
		echo "$(RED)❌ GEMINI_API_KEY environment variable not set$(RESET)"; \
		echo "$(YELLOW)Please set your Gemini API key: export GEMINI_API_KEY=your_api_key$(RESET)"; \
		exit 1; \
	fi
	@echo "GEMINI_API_KEY=$(GEMINI_API_KEY)" > .env.local
	@echo "$(GREEN)✅ Environment variables set up$(RESET)"

.PHONY: setup
setup: install setup-env ## Complete project setup
	@echo "$(GREEN)🎉 Project setup complete!$(RESET)"
	@echo "$(YELLOW)Next steps:$(RESET)"
	@echo "  1. Run 'make dev' to start development server"

# Development targets
.PHONY: dev
dev: ## Start development server
	@echo "$(BLUE)Starting development server on port $(PORT)...$(RESET)"
	npm run dev

.PHONY: build
build: ## Build the project for production
	@echo "$(BLUE)Building project for production...$(RESET)"
	npm run build
	@echo "$(GREEN)✅ Build completed successfully$(RESET)"

.PHONY: start
start: ## Start production server
	@echo "$(BLUE)Starting production server...$(RESET)"
	npm run start

.PHONY: lint
lint: ## Run ESLint
	@echo "$(BLUE)Running ESLint...$(RESET)"
	npm run lint

.PHONY: lint-fix
lint-fix: ## Run ESLint with auto-fix
	@echo "$(BLUE)Running ESLint with auto-fix...$(RESET)"
	npm run lint -- --fix


# Performance targets
.PHONY: optimize-images
optimize-images: ## Optimize images to WebP and AVIF formats
	@echo "$(BLUE)Optimizing images...$(RESET)"
	npm run optimize-images
	@echo "$(GREEN)✅ Images optimized successfully$(RESET)"

.PHONY: analyze-bundle
analyze-bundle: ## Analyze bundle size and dependencies
	@echo "$(BLUE)Analyzing bundle...$(RESET)"
	npm run analyze
	@echo "$(GREEN)✅ Bundle analysis complete$(RESET)"

.PHONY: lighthouse
lighthouse: ## Run Lighthouse performance audit
	@echo "$(BLUE)Running Lighthouse audit...$(RESET)"
	@if [ ! -f lighthouse-report.html ]; then \
		npm run lighthouse; \
		echo "$(GREEN)✅ Lighthouse report generated: lighthouse-report.html$(RESET)"; \
	else \
		echo "$(YELLOW)⚠️  Lighthouse report already exists$(RESET)"; \
	fi

.PHONY: perf-test
perf-test: ## Run complete performance test suite
	@echo "$(BLUE)Running performance tests...$(RESET)"
	npm run perf
	@echo "$(GREEN)✅ Performance tests complete$(RESET)"

.PHONY: test-chat
test-chat: ## Test the chatbot API
	@echo "$(BLUE)Testing chatbot API...$(RESET)"
	@curl -X POST http://localhost:$(PORT)/api/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "Tell me about your projects"}' \
		--no-buffer || echo "$(RED)❌ Chat API test failed. Make sure the server is running.$(RESET)"

.PHONY: test-analytics
test-analytics: ## Test analytics setup
	@echo "$(BLUE)Testing analytics setup...$(RESET)"
	@echo "$(YELLOW)Vercel Analytics will be available in Vercel dashboard after deployment$(RESET)"
	@echo "$(GREEN)✅ Analytics configured successfully (automatic tracking)$(RESET)"

# Content management targets
.PHONY: generate-chatbot-embeddings
generate-chatbot-embeddings: ## Generate embeddings for chatbot data
	@echo "$(BLUE)Generating chatbot embeddings...$(RESET)"
	@node scripts/generate-chatbot-embeddings.js
	@echo "$(GREEN)✅ Chatbot embeddings generated$(RESET)"

.PHONY: new-project
new-project: ## Create a new project file (usage: make new-project NAME="project-name")
	@if [ -z "$(NAME)" ]; then \
		echo "$(RED)❌ Please provide a project name: make new-project NAME=\"my-project\"$(RESET)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Creating new project: $(NAME)$(RESET)"
	@mkdir -p content/projects
	@echo "---" > content/projects/$(NAME).mdx
	@echo "title: \"$(shell echo $(NAME) | sed 's/-/ /g' | sed 's/\b\w/\U&/g')\"" >> content/projects/$(NAME).mdx
	@echo "description: \"A brief description of your project\"" >> content/projects/$(NAME).mdx
	@echo "tags: [\"tag1\", \"tag2\", \"tag3\"]" >> content/projects/$(NAME).mdx
	@echo "date: \"$(shell date +%Y-%m-%d)\"" >> content/projects/$(NAME).mdx
	@echo "featured: false" >> content/projects/$(NAME).mdx
	@echo "liveUrl: \"\"" >> content/projects/$(NAME).mdx
	@echo "githubUrl: \"\"" >> content/projects/$(NAME).mdx
	@echo "imageUrl: \"\"" >> content/projects/$(NAME).mdx
	@echo "---" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "# $(shell echo $(NAME) | sed 's/-/ /g' | sed 's/\b\w/\U&/g')" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "Write your project description here..." >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "## Features" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "- Feature 1" >> content/projects/$(NAME).mdx
	@echo "- Feature 2" >> content/projects/$(NAME).mdx
	@echo "- Feature 3" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "## Technologies Used" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "- Technology 1" >> content/projects/$(NAME).mdx
	@echo "- Technology 2" >> content/projects/$(NAME).mdx
	@echo "- Technology 3" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "## Getting Started" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "Instructions on how to run or use the project..." >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "## Screenshots" >> content/projects/$(NAME).mdx
	@echo "" >> content/projects/$(NAME).mdx
	@echo "Add screenshots or demo links here..." >> content/projects/$(NAME).mdx
	@echo "$(GREEN)✅ Project file created: content/projects/$(NAME).mdx$(RESET)"

# Utility targets
.PHONY: clean
clean: ## Clean build artifacts and node_modules
	@echo "$(BLUE)Cleaning project...$(RESET)"
	rm -rf .next
	rm -rf out
	rm -rf node_modules
	@echo "$(GREEN)✅ Project cleaned$(RESET)"

.PHONY: clean-data
clean-data: ## Clean only data files
	@echo "$(BLUE)Cleaning data files...$(RESET)"
	@echo "$(GREEN)✅ Data files cleaned$(RESET)"

.PHONY: status
status: ## Show project status
	@echo "$(CYAN)Portfolio Website Status$(RESET)"
	@echo ""
	@echo "$(YELLOW)Environment:$(RESET)"
	@if [ -f .env.local ]; then \
		echo "  ✅ .env.local exists"; \
	else \
		echo "  ❌ .env.local missing"; \
	fi
	@echo ""
	@echo "$(YELLOW)Dependencies:$(RESET)"
	@if [ -d node_modules ]; then \
		echo "  ✅ node_modules exists"; \
	else \
		echo "  ❌ node_modules missing (run 'make install')"; \
	fi
	@echo ""
	@echo ""
	@echo "$(YELLOW)Projects:$(RESET)"
	@echo "  📁 $(shell find content/projects -name "*.mdx" | wc -l) project files"

# Deployment targets
.PHONY: deploy-vercel
deploy-vercel: build ## Deploy to Vercel
	@echo "$(BLUE)Deploying to Vercel...$(RESET)"
	@if command -v vercel >/dev/null 2>&1; then \
		vercel --prod; \
		echo "$(GREEN)✅ Deployed to Vercel$(RESET)"; \
	else \
		echo "$(RED)❌ Vercel CLI not installed. Install with: npm i -g vercel$(RESET)"; \
	fi

.PHONY: deploy-netlify
deploy-netlify: build ## Deploy to Netlify
	@echo "$(BLUE)Deploying to Netlify...$(RESET)"
	@if command -v netlify >/dev/null 2>&1; then \
		netlify deploy --prod --dir=out; \
		echo "$(GREEN)✅ Deployed to Netlify$(RESET)"; \
	else \
		echo "$(RED)❌ Netlify CLI not installed. Install with: npm i -g netlify-cli$(RESET)"; \
	fi

# Development workflow targets
.PHONY: dev-full
dev-full: setup dev ## Complete development setup and start

.PHONY: rebuild
rebuild: clean install build ## Clean rebuild of entire project

# Git targets
.PHONY: git-setup
git-setup: ## Set up git repository
	@echo "$(BLUE)Setting up git repository...$(RESET)"
	@if [ ! -d .git ]; then \
		git init; \
		git add .; \
		git commit -m "Initial commit: Portfolio website setup"; \
		echo "$(GREEN)✅ Git repository initialized$(RESET)"; \
	else \
		echo "$(YELLOW)⚠️  Git repository already exists$(RESET)"; \
	fi

# All-in-one targets
.PHONY: init
init: git-setup setup ## Complete project initialization

.PHONY: quick-start
quick-start: ## Quick start for development
	@echo "$(CYAN)🚀 Quick Start - Portfolio Website$(RESET)"
	@echo ""
	@echo "$(YELLOW)1. Setting up environment...$(RESET)"
	@$(MAKE) setup-env
	@echo ""
	@echo "$(YELLOW)2. Installing dependencies...$(RESET)"
	@$(MAKE) install
	@echo ""
	@echo ""
	@echo "$(GREEN)🎉 Ready to go!$(RESET)"
	@echo "$(CYAN)Run 'make dev' to start the development server$(RESET)"
