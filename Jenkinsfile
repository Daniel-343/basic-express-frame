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
      environment {
        DOCKER_IMAGE_NAME = 'basic-express-app'
      }
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
        sh 'docker tag $ECR_REPO_NAME:$BUILD_NUMBER public.ecr.aws/f9j9q9w9/td-ecr-343:$BUILD_NUMBER'
        sh '''docker push public.ecr.aws/f9j9q9w9/$ECR_REPO_NAME:$BUILD_NUMBER

echo "Docker image uploaded to ECR successfully!"'''
      }
    }

  }
}