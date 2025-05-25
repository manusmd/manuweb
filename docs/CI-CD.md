# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline setup for the portfolio website.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and consists of three main workflows:

1. **CI (Continuous Integration)** - Runs on pull requests and pushes
2. **CD (Continuous Deployment)** - Deploys to production on main branch
3. **Dependency Updates** - Automated dependency management and security scanning

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**

- Pull requests to `main` or `develop` branches
- Pushes to `main` or `develop` branches

**Jobs:**

- **CI Job**: Runs on Node.js 18.x and 20.x

  - Type checking with TypeScript
  - ESLint code quality checks
  - Prettier formatting verification
  - Application build verification
  - Build artifact upload (Node.js 20.x only)

- **Security Job**:
  - npm security audit
  - Vulnerability scanning

**Quality Gates:**

- Zero TypeScript errors
- Zero ESLint errors/warnings
- Proper code formatting
- Successful build
- No high/critical security vulnerabilities

### 2. CD Workflow (`.github/workflows/cd.yml`)

**Triggers:**

- Pushes to `main` branch
- Successful completion of CI workflow on `main` branch

**Jobs:**

- **Deploy Job**:

  - Builds the application
  - Deploys to Vercel production environment
  - Requires CI workflow success

- **Notify Job**:
  - Sends deployment status notifications
  - Runs regardless of deployment outcome

**Requirements:**

- Successful CI workflow completion
- Valid Vercel configuration secrets

### 3. Dependency Update Workflow (`.github/workflows/dependency-update.yml`)

**Triggers:**

- Scheduled: Every Monday at 9 AM UTC
- Manual trigger via GitHub Actions UI

**Jobs:**

- **Update Dependencies**:

  - Checks for outdated packages
  - Updates dependencies to latest compatible versions
  - Applies security fixes
  - Runs full CI pipeline on updates
  - Creates automated pull request

- **Security Scan**:
  - Comprehensive security audit
  - Vulnerability assessment
  - Generates security reports

## Code Quality Tools

### ESLint Configuration

**File:** `.eslintrc.json`

**Rules:**

- Next.js core web vitals
- TypeScript recommended rules
- Prettier integration
- Custom rules for code quality

**Key Rules:**

- No unused variables (error)
- Prefer const over let (error)
- No console statements (warning)
- Strict equality checks (error)
- Curly braces required (error)

### Prettier Configuration

**File:** `.prettierrc`

**Settings:**

- Single quotes
- Semicolons required
- 100 character line width
- 2-space indentation
- Trailing commas (ES5)
- LF line endings

### TypeScript Configuration

**Checks:**

- Type safety verification
- No emit compilation
- Strict mode enabled
- Module resolution validation

## Scripts

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Quality Scripts

```bash
npm run lint         # Run Next.js linter
npm run lint:fix     # Fix auto-fixable lint issues
npm run lint:strict  # Strict linting with zero warnings
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # TypeScript type checking
```

### CI/CD Scripts

```bash
npm run ci           # Full CI pipeline locally
npm run prepare      # Pre-commit formatting and linting
```

## Vercel Deployment Setup

### Required Secrets

Add these secrets to your GitHub repository settings:

1. **VERCEL_TOKEN**

   - Generate from Vercel dashboard
   - Account Settings → Tokens → Create Token

2. **VERCEL_ORG_ID**

   - Found in Vercel project settings
   - Project Settings → General → Project ID

3. **VERCEL_PROJECT_ID**
   - Found in Vercel project settings
   - Project Settings → General → Project ID

### Vercel Configuration

The project is configured for automatic deployment with:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`

## Security Features

### Automated Security Scanning

- npm audit integration
- Dependency vulnerability checks
- Security-focused CI gates
- Regular security updates

### Audit Configuration

**File:** `audit-ci.json`

- Scans for all vulnerability levels
- Includes development dependencies
- Generates summary reports
- Configurable allowlist for exceptions

## Branch Protection

### Recommended Settings

- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main branch
- Require linear history

### Status Checks

- CI workflow completion
- All quality gates passed
- Security scan completion
- Build artifact generation

## Monitoring and Notifications

### Deployment Status

- Success/failure notifications
- Build artifact preservation
- Deployment URL generation
- Error reporting and logging

### Dependency Management

- Weekly dependency updates
- Security vulnerability alerts
- Automated pull request creation
- Change impact assessment

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check TypeScript errors
   - Verify dependency compatibility
   - Review ESLint warnings/errors

2. **Deployment Issues**

   - Verify Vercel secrets configuration
   - Check build output size limits
   - Review environment variables

3. **Security Audit Failures**
   - Update vulnerable dependencies
   - Review audit-ci configuration
   - Check for false positives

### Debug Commands

```bash
# Local CI simulation
npm run ci

# Detailed linting
npm run lint:strict -- --debug

# Build analysis
npm run build -- --analyze

# Security audit details
npm audit --audit-level=low
```

## Best Practices

### Code Quality

- Write TypeScript with strict types
- Follow ESLint and Prettier rules
- Maintain test coverage
- Document complex logic

### Git Workflow

- Use descriptive commit messages
- Create focused pull requests
- Review code changes thoroughly
- Keep branches up to date

### Security

- Regularly update dependencies
- Monitor security advisories
- Use environment variables for secrets
- Implement proper access controls

### Performance

- Optimize bundle size
- Monitor build times
- Use appropriate caching strategies
- Implement performance budgets

## Maintenance

### Regular Tasks

- Review and update dependencies monthly
- Monitor CI/CD performance metrics
- Update security configurations
- Review and optimize workflows

### Quarterly Reviews

- Assess tool effectiveness
- Update quality standards
- Review security practices
- Optimize deployment processes
