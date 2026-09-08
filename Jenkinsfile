pipeline {
    agent any

    parameters {
        string(name: 'IMAGE_TAG', defaultValue: params.IMAGE_TAG ?:'latest-dev',  description: 'Docker image tag')
    }

    environment {
        COMPOSE_FILE_NAME = "docker-compose-jenkins.yml"
        PROJECT_NAME = "bt-local"
        ENV_FILE_PATH = "/var/jenkins_secrets/secrets.env"
        CONTAINER_NAME = "biotablero_front_dev"
        IMAGE_TAG = "${params.IMAGE_TAG}"
    }

    stages {
        stage('Stop container') {
            steps {
                script {
                    echo "Stopping the ${CONTAINER_NAME} container..."
                    sh "docker compose -p ${PROJECT_NAME} --env-file ${ENV_FILE_PATH} -f ${COMPOSE_FILE_NAME} down"
                }
            }
        }

        stage('Deploy new container version') {
            steps {
                script {
                    echo "Deploying the ${CONTAINER_NAME} container..."
                    sh """
                        export DEFAULT_TAG=${IMAGE_TAG}
                        docker compose -p ${PROJECT_NAME} --env-file ${ENV_FILE_PATH} -f ${COMPOSE_FILE_NAME} up -d
                    """
                }
            }
        }
    }
    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }
}