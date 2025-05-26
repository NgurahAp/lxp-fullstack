pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "lxp"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "🔄 Cloning repo..."
                git 'https://github.com/username/project.git' // Ganti ke URL repo kamu
            }
        }

        stage('Build and Run Containers') {
            steps {
                script {
                    try {
                        echo "🔧 Building docker images..."
                        sh 'docker-compose build'

                        echo "🚀 Starting services..."
                        sh 'docker-compose up -d'

                    } catch (Exception err) {
                        echo "❌ ERROR: Failed during build or up"
                        echo "📝 Error Message: ${err.getMessage()}"

                        // Kamu bisa lakukan cleanup kalau mau:
                        echo "🧹 Cleaning up..."
                        sh 'docker-compose down || true'

                        // Gagalin pipeline secara eksplisit
                        error("❗ Pipeline stopped due to failure in Docker steps.")
                    }
                }
            }
        }

        stage('Check Services') {
            steps {
                echo "🔍 Verifying containers..."
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully"
        }
        failure {
            echo "❌ Pipeline failed"
        }
        always {
            echo "📦 Final state of containers:"
            sh 'docker ps -a || true'
        }
    }
}
