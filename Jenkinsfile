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
        sh 'docker tag $DOCKER_IMAGE_NAME:$BUILD_NUMBER public.ecr.aws/f9j9q9w9/td-ecr-343:$BUILD_NUMBER'
        sh '''docker push public.ecr.aws/f9j9q9w9/$ECR_REPO_NAME:$BUILD_NUMBER

echo "Docker image uploaded to ECR successfully!"'''
      }
    }

    stage('Deploy') {
      environment {
        AWS_REGION = 'eu-central-1'
        ECS_CLUSTER_NAME = 'express-cluster'
        ECS_SERVICE_NAME = 'express-service3'
        ECR_REPO_NAME = 'td-ecr-343'
        TASK_DEFINITION_FAMILY = 'td-express-app-task'
      }
      steps {
        sh '''latest_revision=$(aws ecs describe-task-definition \\
  --region $AWS_REGION \\
  --task-definition $TASK_DEFINITION_FAMILY \\
  --query \'taskDefinition.revision\' \\
  --output text)

existing_task_definition=$(aws ecs describe-task-definition \\
  --region $AWS_REGION \\
  --task-definition $TASK_DEFINITION_FAMILY:$latest_revision)

updated_task_definition=$(echo "$existing_task_definition" | \\
  jq --arg DOCKER_IMAGE_TAG "$BUILD_NUMBER" \\
  \'.taskDefinition.containerDefinitions[].image |= sub(":.*$"; ":$BUILD_NUMBER")\')

new_task_definition_arn=$(aws ecs register-task-definition \\
  --region $AWS_REGION \\
  --cli-input-json "$updated_task_definition" \\
  --query \'taskDefinition.taskDefinitionArn\' \\
  --output text)

aws ecs update-service \\
  --region $AWS_REGION \\
  --cluster $ECS_CLUSTER_NAME \\
  --service $ECS_SERVICE_NAME \\
  --task-definition $new_task_definition_arn'''
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