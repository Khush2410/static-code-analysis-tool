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
                    echo "[+] Installing dependencies..."

                    # Try to install make if it's not present
                    if ! command -v make >/dev/null; then
                      echo "Installing make..."
                      sudo apt-get update && sudo apt-get install -y make
                    fi

                    # Check for node and npm
                    if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
                      echo "Node.js or npm not found. Please preinstall Node.js on this agent."
                      exit 1
                    fi

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
