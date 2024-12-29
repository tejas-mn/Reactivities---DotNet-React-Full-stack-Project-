pipeline {
    agent any

    environment {
        DOTNET_VERSION = '8.0.x'              // .NET Core SDK version
        NODE_VERSION = '20'                  // Node.js version
        BUILD_CONFIGURATION = 'Release'      // Build configuration
        PUBLISH_DIRECTORY = "publish"        // Directory to publish the application
        RESOURCE_GROUP = 'YourResourceGroup' // Azure Resource Group
        WEB_APP_NAME = 'YourWebAppName'      // Azure Web App name
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out source code from Git...'
                git branch: 'main', url: 'https://github.com/your-username/your-repository.git'
            }
        }

        stage('Set Up Node.js') {
            steps {
                echo 'Setting up Node.js environment...'
                script {
                    // Use Node.js environment for building the React frontend
                    def nodeHome = tool name: "NodeJS-${NODE_VERSION}", type: 'NodeJS'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Build React Frontend') {
            steps {
                echo 'Building React frontend...'
                dir('client-app') {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Set Up .NET Core') {
            steps {
                echo 'Setting up .NET Core environment...'
                sh """
                curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel ${DOTNET_VERSION}
                export PATH=$HOME/.dotnet:$PATH
                dotnet --version
                """
            }
        }

        stage('Build and Publish ASP.NET Core Backend') {
            steps {
                echo 'Building and publishing ASP.NET Core backend...'
                sh """
                dotnet build --configuration ${BUILD_CONFIGURATION}
                dotnet publish --configuration ${BUILD_CONFIGURATION} --output ${WORKSPACE}/${PUBLISH_DIRECTORY}
                """
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: "${PUBLISH_DIRECTORY}/**", allowEmptyArchive: false
            }
        }

        stage('Deploy to Azure Web App') {
            steps {
                echo 'Deploying to Azure Web App...'
                withCredentials([azureServicePrincipal(
                    credentialsId: 'azure-service-connection-id',
                    subscriptionIdVariable: 'AZURE_SUBSCRIPTION_ID',
                    clientIdVariable: 'AZURE_CLIENT_ID',
                    clientSecretVariable: 'AZURE_CLIENT_SECRET',
                    tenantIdVariable: 'AZURE_TENANT_ID'
                )]) {
                    sh """
                    az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
                    az webapp deployment source config-zip \
                        --resource-group ${RESOURCE_GROUP} \
                        --name ${WEB_APP_NAME} \
                        --src-path ${WORKSPACE}/${PUBLISH_DIRECTORY}.zip
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please check the logs for details.'
        }
    }
}
