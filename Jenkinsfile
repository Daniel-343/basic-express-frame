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
        sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com'
        sh 'docker tag $ECR_REPO_NAME:$BUILD_NUMBER $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$BUILD_NUMBER'
        sh '''docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$BUILD_NUMBER

echo "Docker image uploaded to ECR successfully!"'''
      }
    }

  }
}