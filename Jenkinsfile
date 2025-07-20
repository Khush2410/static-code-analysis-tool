pipeline {
    agent any

    options {
        skipDefaultCheckout true
    }

    triggers {
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref'],
                [key: 'head_sha', value: '$.pull_request.head.sha'],
                [key: 'pr_number', value: '$.number'],
                [key: 'action', value: '$.action']
            ],
            token: 'a-very-secret-string',
            causeString: 'Triggered by GitHub PR #${pr_number}',
            printPostContent: true,
            printContributedVariables: true,
            regexpFilterText: '$action',
            regexpFilterExpression: '^(opened|reopened|synchronize)$'
        )
    }

    environment {
        NODE_VERSION = "18.17.1"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                githubNotify context: 'ESLint-Check', status: 'PENDING'
            }
        }

        stage('Setup Node and Dependencies') {
            steps {
                sh '''
                    echo "Installing Node.js..."

                    # Clean environment installation of Node.js (without apt)
                    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION.x | bash -
                    apt-get install -y nodejs make

                    echo "Node version:"
                    node -v

                    echo "npm version:"
                    npm -v

                    echo "Installing npm packages..."
                    npm install
                '''
            }
        }

        stage('Run ESLint CI') {
            steps {
                script {
                    try {
                        sh 'make ci'
                        githubNotify context: 'ESLint-Check', status: 'SUCCESS'
                    } catch (Exception e) {
                        githubNotify context: 'ESLint-Check', status: 'FAILURE'
                        error "ESLint checks failed: ${e.getMessage()}"
                    }
                }
            }
        }
    }
}
