---
layout: default
title: Onboarding Guide
parent: Getting Started
---

# Onboarding Guide

Use this guide to quickly understand what platforms and resources exist across the Swasthx documentation ecosystem and how to gain access to them. Each item below links back to the systems that power our work, so you always know where something lives before you dive deeper.

## Platforms We Use

- **AWS** – Primary cloud platform for hosting services and infrastructure. Ask an admin to create an IAM role for you before attempting to access any resources.  
  - Review details on every AWS service we run and the configuration choices behind them.
- **Postman** – Shared workspace for testing APIs. Join via [this invite link](https://app.getpostman.com/join-team?invite_code=afa5d37dcd9c593cec7a7c1748673b128c4c5115fc844f9263257a5238c00bc2&target_code=ee0c45dae4f1707b08e870b6068709f7). If you see an access denied message, ping the admin to be added to the team.
  - Explore the backend APIs built for the PHR app and the website.
  - Inspect request/response bodies, headers, and other details for each API.
- **GitHub** – Source control for every codebase (PHR, website, and supporting tools). The organization lives at [github.com/Swasthx](https://github.com/Swasthx); request collaborator access from the admin.
  - Identify the repositories used for PHR frontend/backend and website frontend/backend work.
- **Slack** – Internal communication hub. The admin will send an invite and onboard you to the right channels.
- **Google Drive** – Central store for documents, builds, and keys. Important folders:
  - [Tech Development (Android APKs)](https://drive.google.com/drive/folders/1Hl2yvmXMTIGU-R2cGXOeW-6EucGtXxyE?usp=sharing)
  - [Keys and Credentials](https://drive.google.com/drive/folders/1R6ylRxaImL5NZUEc2y8iKAjn_kKPt4TZ?usp=sharing)
  - [iOS Builds](https://drive.google.com/drive/folders/1oGzG5uIjLnLmychI1TL9gduKEPltpGvP?usp=sharing)
  - [Planning and Process Docs](https://drive.google.com/drive/folders/1heWlts1vMAHP_PamCqemcRj8-FgehYtU?usp=sharing)
- **MongoDB Compass** – Local tool for connecting to MongoDB databases when needed. [Download Compass](https://www.mongodb.com/products/tools/compass), get your IP address whitelisted, then request the `.pem` key, hostname, and any other connection details from the admin.
- **ABDM Sandbox** – Reference documentation for integrating ABDM APIs. Bookmark the [sandbox docs](https://sandbox.abdm.gov.in/sandbox/v3/new-documentation?doc=UsingAdhharOpt) and confirm access with the admin if needed.
  - Learn which ABDM APIs are integrated into the website and PHR app.
  - Review the flows supported in each milestone.
- **1mg Sandbox** – Test environment for medicine and lab test integrations. Coordinate with the integrations team for credentials.

  - <a href="https://onedoc.ekdosis.com/docs/pharma_docs/" target="_blank">1MG documentation for medicine APIs</a>
  - <a href="https://onedoc.ekdosis.com/docs/labs_docs/" target="_blank">1MG documentaion for lab test APIs</a>
- **Google Play Console** – Used to publish Android builds. Access the console at [play.google.com/console](https://play.google.com/console/u/3/developers/7322562159725037649/app-list) once the admin shares permissions.
- **App Store Connect** – Used for iOS releases. Sign in at [appstoreconnect.apple.com](https://appstoreconnect.apple.com/login) after being added to the Swasthx account.

## How to Use This Guide

1. Start with the platform overview above to confirm where a component lives (infra, source, builds, docs, etc.).
2. Request the appropriate access (IAM role, repository collaboration, workspace invites) from the admin before attempting to work in that area.
3. Use the provided links as jump-off points to deeper documentation—each platform stores the authoritative resources for its domain.

With these pointers you should always know what exists in our ecosystem, why we use it, and how to find it quickly. Reach out on Slack if anything is missing or access requests are pending.
