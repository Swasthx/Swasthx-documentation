---
layout: default
title: Onboarding Guide
permalink: /onboarding-guide
---

# SwasthX Developer Onboarding Guide

## Welcome to SwasthX!

This guide will help you set up your development environment, understand our documentation structure, and get familiar with our codebase and workflows.

## Documentation Navigation

### Finding Information
1. **Home Page**
   - Start with the [home page](/)
   - Cards are organized by category (Development, Database, APIs, etc.)
   - Each card lists key content areas with direct links

2. **Search**
   - Use the search bar at the top right
   - Search by keywords, file names, or content

3. **Table of Contents**
   - Each page has a collapsible TOC
   - Shows h2 and h3 headings
   - Click any heading to jump to that section

### Documentation Maintenance

1. **Updating Documentation**
   - Documentation lives in the `docs` directory
   - Follow these file naming conventions:
     - Use kebab-case for filenames (e.g., `coding-standards.md`)
     - Keep file names short but descriptive
   - Update the `last_updated` field in the front matter when making changes

2. **Style Guidelines**
   - Use clear, concise language
   - Break content into short paragraphs and lists
   - Use headings to organize content (h2 for main sections, h3 for subsections)
   - Add code examples where helpful
   - Include relevant screenshots for UI elements

3. **Review Process**
   - Create a PR for documentation changes
   - Request review from at least one team member
   - Update the changelog for significant changes

## Team Structure

### Development Team
- **Backend Team**: [List of backend developers and their responsibilities]
- **Frontend Team**: [List of frontend developers and their responsibilities]
- **DevOps Team**: [List of DevOps engineers and their responsibilities]
- **QA Team**: [List of QA engineers and their responsibilities]

### Project Management
- **Product Owners**: [Names and contact info]
- **Scrum Masters**: [Names and contact info]

## Codebase Repositories

### Backend
- **Main Repository**: [github.com/Swasthx/swasthx_Backend](https://github.com/Swasthx/swasthx_Backend.git)
  - Description: Core backend services and APIs
  - Tech Stack: [List of technologies used]

### Frontend
- **Web Application**: [GitHub Link]
  - Description: Patient and provider web interface
  - Tech Stack: [List of technologies used]
- **Mobile App**: [GitHub Link] (if applicable)
  - Description: Mobile application for patients and providers
  - Tech Stack: [List of technologies used]

### Other Repositories
- **Documentation**: [GitHub Link]
- **DevOps**: [GitHub Link]

## Table of Contents
1. [Team Structure](#team-structure)
2. [Codebase Repositories](#codebase-repositories)
3. [Development Tools](#development-tools)
4. [Development Setup](#development-setup)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Development Workflow](#development-workflow)
6. [Code Review Process](#code-review-process)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Platforms We Work With](#platforms-we-work-with)
10. [Useful Commands](#useful-commands)
11. [Troubleshooting](#troubleshooting)
12. [Getting Help](#getting-help)

## Development Tools

### Communication
- **Email**: firstname.lastname@swasthx.com (for official communication)
- **Slack**:
  - #general - Team announcements and discussions
  - #dev - Technical discussions and help
  - #alerts - System notifications

### Version Control
- **GitHub**: [github.com/Swasthx](https://github.com/Swasthx)
  - Branching strategy: Git Flow
  - PR template: Fill all required fields
  - Review: At least one approval required

### Development Tools
- **VS Code** with standard extensions
- **Postman** for API testing
- **MongoDB Compass** for database management
- **Docker** for containerization

### Project Management
- **Jira** for issue tracking
- **Confluence** for documentation
- **Sentry** for error tracking

## Development Setup

### Prerequisites

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

### Backend Setup

For detailed backend setup instructions, please refer to the [Backend Development Guide](link-to-backend-readme) in the repository.

### Frontend Setup

For detailed frontend setup instructions, please refer to the [Frontend Development Guide](link-to-frontend-readme) in the repository.

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
git clone https://github.com/Swasthx/swasthx_Backend.git
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

## Platforms We Work With

### Healthcare Integration
- ABDM (Ayushman Bharat Digital Mission)
- [Other healthcare platforms]

### Payment Gateways
- [List of payment gateways]

### Third-party Services
- [List of third-party services]

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

### Support Channels
- **Technical Support**: #support channel in Slack
- **Urgent Issues**: [Emergency contact information]
- **Mentorship**: [Mentorship program details]

### Learning Resources
- [Internal documentation]
- [External learning resources]
- [Training materials]

### Team Availability
- **Stand-up Meetings**: [Time and Zoom link]
- **Sprint Planning**: [Schedule]
- **Office Hours**: [If applicable]

- **Slack**: Join our `#engineering` channel
- **Email**: dev-support@swasthx.in
- **Documentation**: https://docs.swasthx.in
- **Team Lead**: @your-team-lead

## Next Steps
- Read the [Coding Standards](./coding-standards.md)
- Check out the [API Documentation](./api-documentation.md)
- Join the next team standup
- Don't hesitate to ask questions!
