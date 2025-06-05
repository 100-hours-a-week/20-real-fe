#!/bin/bash
docker stop next-app || true
docker rm next-app| true

aws ecr get-login-password --region ap-northeast-2 | \
docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-2.amazonaws.com

docker pull <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/<ECR_REPOSITORY>:<IMAGE_TAG>

docker run -d --name next-app -p 3000:3000 \
  -e ENV=<ENV> \
  <AWS_ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/<ECR_REPOSITORY>:<IMAGE_TAG>