# Portfolio Website Makefile

PORT := 3000

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
CYAN := \033[0;36m
RESET := \033[0m

.DEFAULT_GOAL := help

.PHONY: help
help: ## Show this help message
	@echo "$(CYAN)Portfolio Website - Available Commands$(RESET)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

.PHONY: install
install: ## Install all dependencies
	npm install

.PHONY: dev
dev: ## Start development server
	npm run dev

.PHONY: build
build: ## Build the project for production
	npm run build

.PHONY: start
start: ## Start production server
	npm run start

.PHONY: lint
lint: ## Run ESLint
	npm run lint

.PHONY: lint-fix
lint-fix: ## Run ESLint with auto-fix
	npm run lint -- --fix

.PHONY: test
test: ## Run unit tests
	npm test

.PHONY: preview
preview: ## Build and preview the Cloudflare Workers deployment locally
	npm run preview

.PHONY: deploy
deploy: ## Build and deploy to Cloudflare Workers
	npm run deploy

.PHONY: optimize-images
optimize-images: ## Optimize images to WebP and AVIF formats
	npm run optimize-images

.PHONY: analyze-bundle
analyze-bundle: ## Analyze bundle size and dependencies
	npm run analyze

.PHONY: test-chat
test-chat: ## Test the chatbot API against a local dev server
	@curl -X POST http://localhost:$(PORT)/api/chat \
		-H "Content-Type: application/json" \
		-d '{"message": "Tell me about your projects"}' \
		--no-buffer || echo "$(RED)❌ Chat API test failed. Make sure the server is running.$(RESET)"

.PHONY: clean
clean: ## Clean build artifacts and node_modules
	rm -rf .next .open-next out node_modules
