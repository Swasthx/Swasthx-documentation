---
layout: default
title: PHR Backend
parent: Backend
grand_parent: Workflows & Processes
---

# PHR Backend

The PHR Backend follows the exact same deployment process as the Website Backend.

*   **Deployment Pipeline**: GitHub Actions
*   **Triggers**: Pushing commits to `development`, `qa`, or `production`.
*   **Process**:
    1.  **GitHub Actions** pulls the latest code.
    2.  Creates the image in **AWS EKS**.
    3.  Triggers automated deployment via **AWS App Runner**.

### Detailed Workflow & Configuration

The PHR Backend uses a nearly identical configuration.

**Key Steps:**
1.  **Env Setup & Auth**: Securely loads environment variables and AWS credentials.
2.  **Containerization**: Builds the PHR backend Docker image and pushes to ECR.
3.  **Deployment**: Updates the specific App Runner service for PHR.
4.  **Health Check**: Verifies the service stabilizes in `RUNNING` state.

```yaml
name: Build and Deploy Swasthx API to AWS App Runner

on:
  push:
    branches:
      - development

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: swasthx-backend
  IMAGE_TAG: ${{ github.sha }}

jobs:
  deploy:
    name: Deploy swasthx-backend to AWS App Runner
    runs-on: ubuntu-latest

    steps:
      - name: Checkout to repo
        uses: actions/checkout@v4

      - name: Create .env file from secret
        run: |
          echo "${{ secrets.ENV_FILE_NEW }}" > .env

      - name: Set AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push Docker image to ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          docker build -t $ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }} .
          docker push $ECR_REGISTRY/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}

      - name: Deploy to AWS App Runner (explicit config)
        run: |
          aws apprunner update-service \
            --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN_LATEST }} \
            --source-configuration "{
              \"ImageRepository\": {
                \"ImageIdentifier\": \"${{ steps.login-ecr.outputs.registry }}/${{ env.ECR_REPOSITORY }}:${{ env.IMAGE_TAG }}\",
                \"ImageRepositoryType\": \"ECR\",
                \"ImageConfiguration\": {
                  \"Port\": \"3000\"
                }
              },
              \"AutoDeploymentsEnabled\": false,
              \"AuthenticationConfiguration\": {
                \"AccessRoleArn\": \"arn:aws:iam::515966508772:role/service-role/AppRunnerECRAccessRole\"
              }
            }"

      - name: Wait for App Runner update to complete
        run: |
          echo "Waiting for App Runner to finish deployment..."
          attempt=0
          until [[ "$status" == "RUNNING" || $attempt -ge 20 ]]; do
            sleep 15
            status=$(aws apprunner describe-service \
              --service-arn ${{ secrets.APP_RUNNER_SERVICE_ARN_LATEST }} \
              --query "Service.Status" --output text)
            echo "Attempt $((++attempt)): Status = $status"
          done

          if [[ "$status" != "RUNNING" ]]; then
            echo "Deployment did not complete successfully within expected time." >&2
            exit 1
          fi

          echo "App Runner service is now RUNNING."
```
