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
        ECR_REPO = 'public.ecr.aws/f9j9q9w9/td-ecr-343'
        TASK_DEFINITION_FAMILY = 'td-express-app-task'
      }
      steps {
        sh '''#!/bin/bash

IMAGE_URI="${ECR_REPO}${BUILD_NUMBER}"

latest_revision=$(aws ecs describe-task-definition \\
  --region $AWS_REGION \\
  --task-definition $TASK_DEFINITION_FAMILY \\
  --query \'taskDefinition.revision\' \\
  --output text)

existing_task_definition=$(aws ecs describe-task-definition \\
  --region $AWS_REGION \\
  --task-definition $TASK_DEFINITION_FAMILY:"$latest_revision")

updatedTaskDefinition=$(echo "$existing_task_definition" | jq ".taskDefinition.containerDefinitions[0].image = \\"${ECR_REPO}:${DOCKER_IMAGE_TAG}\\"" | jq \'.taskDefinition.revision = 22\')


NEW_TASK_DEFINITION=$(echo "$updatedTaskDefinition" | jq --arg IMAGE "$IMAGE_URI" \'.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)\')

#echo $updatedTaskDefinition

aws ecs register-task-definition \\
  --cli-input-json "$NEW_TASK_DEFINITION"\\
  --family "$TASK_DEFINITION_FAMILY"\\




echo "Task definition updated with the new image tag."
'''
        sh '''aws ecs update-service \\
    --region $AWS_REGION \\
    --cluster $ECS_CLUSTER_NAME \\
    --service $ECS_SERVICE_NAME \\
    --task-definition $TASK_DEFINITION_FAMILY\\
    --force-new-deployment

echo "ECS service updated with the new Docker image."'''
      }
    }

  }
  environment {
    DOCKER_IMAGE_NAME = 'basic-express-app'
  }
}