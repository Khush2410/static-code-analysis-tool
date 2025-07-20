pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u root:root' // ensures root permissions for the container
        }
    }

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

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                githubNotify context: 'ESLint-Check', status: 'PENDING'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    echo "Node version:"
                    node -v

                    echo "NPM version:"
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
