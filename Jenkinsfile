pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
        git(url: 'https://github.com/Daniel-343/basic-express-frame', branch: 'main')
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -t "${env.DOCKER_IMAGE_NAME}:${env.BUILD_NUMBER}" .'
      }
    }

  }
  environment {
    DOCKER_IMAGE_NAME = 'basic-express-app'
  }
}