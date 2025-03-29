# Makefile for Full-Stack Chat Application

# Variables
VITE_PORT = 3000
BACKEND_PORT = 8000
BACKEND_API_PREFIX = /api
NODE_ENV ?= development
PYTHON_ENV ?= venv
PYTHON = python3
PIP = $(PYTHON_ENV)/bin/pip
PYTHON_BIN = $(PYTHON_ENV)/bin/python

.PHONY: all setup clean dev build test lint typecheck backend frontend install-deps help setup-proxy deploy

# Default target
all: help

# Setup project
setup: install-deps setup-venv setup-backend setup-proxy

# Install frontend dependencies
install-deps:
	@echo "Installing frontend dependencies..."
	pnpm install

# Setup Python virtual environment
setup-venv:
	@echo "Setting up Python virtual environment..."
	$(PYTHON) -m venv $(PYTHON_ENV)
	$(PIP) install --upgrade pip

# Setup backend
setup-backend: setup-venv
	@echo "Installing backend dependencies..."
	$(PIP) install -r requirements.txt

# Run development server (both frontend and backend)
dev: dev-backend dev-frontend

# Run frontend development server
dev-frontend:
	@echo "Starting frontend development server..."
	pnpm dev --port $(VITE_PORT)

# Run backend development server
dev-backend:
	@echo "Starting backend development server..."
	$(PYTHON_BIN) -m uvicorn main:app --reload --port $(BACKEND_PORT)

# Build for production
build: build-frontend

# Build frontend for production
build-frontend:
	@echo "Building frontend for production..."
	NODE_ENV=production pnpm build
	@echo "Copying backend files to dist/backend..."
	mkdir -p dist/backend
	cp -r backend dist/
	cp main.py dist/
	cp requirements.txt dist/

# Test application
test: test-frontend test-backend

# Run frontend tests
test-frontend:
	@echo "Running frontend tests..."
	pnpm test

# Run backend tests (if you have any)
test-backend:
	@echo "Running backend tests..."
	$(PYTHON_BIN) -m pytest

# Lint code
lint:
	@echo "Linting frontend code..."
	pnpm lint

# Typecheck TypeScript
typecheck:
	@echo "Running TypeScript type checking..."
	pnpm typecheck

# Preview production build
preview:
	@echo "Previewing production build..."
	pnpm preview --port $(VITE_PORT)

# Clean up
clean: clean-frontend clean-backend

# Clean frontend
clean-frontend:
	@echo "Cleaning frontend build artifacts..."
	rm -rf dist
	rm -rf node_modules

# Clean backend
clean-backend:
	@echo "Cleaning backend artifacts..."
	rm -rf $(PYTHON_ENV)
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Run both frontend and backend in parallel
start:
	@echo "Starting both frontend and backend..."
	(trap 'kill 0' SIGINT; $(MAKE) dev-backend & $(MAKE) dev-frontend)

# Format code
format:
	@echo "Formatting code..."
	pnpm eslint . --fix

# Help target
help:
	@echo "Available targets:"
	@echo "  setup           - Set up the project (install dependencies)"
	@echo "  dev             - Run development servers (frontend and backend)"
	@echo "  dev-frontend    - Run frontend development server only"
	@echo "  dev-backend     - Run backend development server only"
	@echo "  build           - Build for production"
	@echo "  test            - Run tests"
	@echo "  lint            - Lint code"
	@echo "  typecheck       - Run TypeScript type checking"
	@echo "  preview         - Preview production build"
	@echo "  clean           - Clean up build artifacts"
	@echo "  start           - Run both frontend and backend in parallel"
	@echo "  format          - Format code"
	@echo "  setup-proxy     - Create Vite proxy configuration for backend"
	@echo "  deploy          - Run production build with backend API"