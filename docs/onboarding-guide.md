# SwasthX Developer Onboarding Guide

## Welcome to SwasthX!

This guide will help you set up your development environment and get familiar with our codebase and workflows.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Setup](#project-setup)
4. [Development Workflow](#development-workflow)
5. [Code Review Process](#code-review-process)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Useful Commands](#useful-commands)
9. [Troubleshooting](#troubleshooting)
10. [Getting Help](#getting-help)

## Prerequisites

### Hardware Requirements
- Computer with at least 8GB RAM (16GB recommended)
- At least 10GB free disk space
- Modern multi-core processor

### Software Requirements
- Node.js 16+ (LTS version recommended)
- npm 8+ or yarn
- Git 2.20+
- MongoDB 4.4+
- Docker (optional, for containerized development)
- VS Code (recommended) or another code editor

### Recommended VS Code Extensions
- ESLint
- Prettier - Code formatter
- GitLens
- Docker
- Jest Runner
- REST Client

## Development Environment Setup

### 1. Install Node.js and npm
- Download and install from [Node.js official website](https://nodejs.org/)
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. Install MongoDB
- [Download and install MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- Or use Docker:
  ```bash
  docker run --name swasthx-mongo -p 27017:27017 -d mongo:4.4
  ```

### 3. Clone the Repository
```bash
git clone https://github.com/your-org/swasthx-backend.git
cd swasthx-backend
```

### 4. Install Dependencies
```bash
npm install
# or
yarn install
```

### 5. Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your local configuration

## Project Setup

### Directory Structure
```
swasthx-backend/
├── src/                    # Source code
│   ├── common/            # Shared utilities and constants
│   ├── config/            # Configuration files
│   ├── modules/           # Feature modules
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── test/                  # Test files
├── .env                   # Environment variables
├── package.json
└── README.md
```

### Available Scripts
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot-reload
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run test coverage
- `npm run lint` - Lint the codebase
- `npm run format` - Format the code

## Development Workflow

### 1. Branching Strategy
We use Git Flow with the following branch types:
- `main` - Production code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### 2. Creating a New Feature
1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat(module): add your feature"
   ```

3. Push your branch:
   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create a Pull Request (PR) to `develop`

### 3. Code Review Process
- All PRs require at least one approval
- Address all review comments before merging
- Ensure all tests pass
- Update documentation if needed

## Testing

### Running Tests
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`
- Test coverage: `npm run test:cov`

### Writing Tests
- Place test files next to the code they test
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies

## Deployment

### Staging
- Automatic deployment on push to `develop`
- URL: https://staging.swasthx.in

### Production
- Manual deployment from `main`
- URL: https://app.swasthx.in

## Useful Commands

### Database
```bash
# Start MongoDB
mongod --dbpath /path/to/data/db

# Connect to MongoDB shell
mongo

# Reset database (development only)
npm run db:reset
```

### Docker
```bash
# Build image
docker build -t swasthx-backend .

# Run container
docker run -p 3000:3000 --env-file .env swasthx-backend

# Run with MongoDB
docker-compose up
```

## Troubleshooting

### Common Issues
1. **Port already in use**
   ```bash
   # Find and kill the process
   lsof -i :3000
   kill -9 <PID>
   ```

2. **MongoDB connection issues**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Try restarting MongoDB

3. **Dependency issues**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Getting Help

- **Slack**: Join our `#engineering` channel
- **Email**: dev-support@swasthx.in
- **Documentation**: https://docs.swasthx.in
- **Team Lead**: @your-team-lead

## Next Steps
- Read the [Coding Standards](./coding-standards.md)
- Check out the [API Documentation](./api-documentation.md)
- Join the next team standup
- Don't hesitate to ask questions!
