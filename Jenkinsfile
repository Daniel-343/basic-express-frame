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

  }
}