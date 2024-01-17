pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        git(url: 'https://github.com/Daniel-343/basic-express-frame', branch: 'main')
      }
    }

    stage('Build') {
      agent any
      steps {
        sh 'docker build -t "${DOCKER_IMAGE_NAME}:${BUILD_NUMBER}" .'
      }
    }

    stage('Upload') {
      agent any
      environment {
        AWS_REGION = 'eu-central-1'
        AWS_ACCOUNT_ID = '610441724115'
        ECR_REPO_NAME = 'td-ecr-343'
      }
      steps {
        sh 'aws ecr-public get-login-password --region us-east-1 | docker login --username AWS --password-stdin public.ecr.aws/f9j9q9w9'
        sh 'docker tag $DOCKER_IMAGE_NAME:$BUILD_NUMBER public.ecr.aws/f9j9q9w9/td-ecr-343:latest'
        sh '''docker push public.ecr.aws/f9j9q9w9/$ECR_REPO_NAME:latest

echo "Docker image uploaded to ECR successfully!"'''
      }
    }

    stage('Deploy') {
      environment {
        AWS_REGION = 'eu-central-1'
        ECS_CLUSTER_NAME = 'express-cluster'
        ECS_SERVICE_NAME = 'express-service3'
        ECR_REPO_NAME = 'td-ecr-343'
      }
      steps {
        sh '''aws ecs update-service \\
    --region $AWS_REGION \\
    --cluster $ECS_CLUSTER_NAME \\
    --service $ECS_SERVICE_NAME \\
    --force-new-deployment

echo "ECS service updated with the new Docker image."'''
      }
    }

  }
  environment {
    DOCKER_IMAGE_NAME = 'basic-express-app'
  }
}