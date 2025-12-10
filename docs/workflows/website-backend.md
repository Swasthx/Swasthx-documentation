---
layout: default
title: Website Backend
parent: Backend
grand_parent: Workflows & Processes
---

# Website Backend

The Website Backend utilizes a containerized deployment flow using **GitHub Actions**, **AWS EKS**, and **AWS App Runner**.

*   **Deployment Pipeline**: GitHub Actions
*   **Triggers**: Pushing commits to `development`, `qa`, and `production`.
*   **Process**:
    1.  **GitHub Actions** triggers on the push event.
    2.  It pulls the latest code from the repository.
    3.  It builds a Docker image and creates it in **AWS EKS** (Elastic Kubernetes Service).
    4.  Once the image is created, **AWS App Runner** deployment is triggered automatically to serve the application.

### Detailed Workflow & Configuration

The deployment process is defined in a `.yml` file (typically in `.github/workflows/`). Below is the standard configuration used for the Website Backend.

**Key Steps Explained:**
1.  **Checkout**: Pulls the code from the repository.
2.  **Environment Setup**: Creates environmental variables from secrets.
3.  **Authentication**: Configures AWS credentials (`aws-actions/configure-aws-credentials`).
4.  **Build & Push**: Logs into Amazon ECR, builds the Docker image, and pushes it with the commit SHA as the tag.
5.  **Deploy**: Updates the AWS App Runner service to use the newly pushed image.
6.  **Verification**: Polls the App Runner service status until it reaches `RUNNING` state to ensure success.

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
