---
layout: default
title: Branching Strategy
---

# Branching Strategy

This document outlines the branching strategy used in the Swasthx project.

## Main Branches

- `main` - Production-ready code
- `develop` - Integration branch for features

## Supporting Branches

- `feature/` - New features being developed
- `bugfix/` - Bug fixes
- `release/` - Release preparation
- `hotfix/` - Critical production fixes

## Workflow

1. Create a feature branch from `develop`
2. Work on your feature
3. Create a pull request to `develop`
4. After review and testing, merge to `develop`
5. When ready for release, create a release branch
6. After final testing, merge to `main` and tag the release
