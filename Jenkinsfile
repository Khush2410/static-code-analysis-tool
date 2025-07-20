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
                    echo "[+] Checking environment..."
                    
                    echo "Node version:"
                    node -v || echo "Node not found"

                    echo "NPM version:"
                    npm -v || echo "NPM not found"

                    echo "Make version:"
                    make -v || echo "Make not found"

                    # Try to install make ONLY if it's missing and agent has apt-get and is root
                    if ! command -v make >/dev/null; then
                      if [ "$(id -u)" -eq 0 ] && command -v apt-get >/dev/null; then
                        echo "Installing make..."
                        apt-get update && apt-get install -y make
                      else
                        echo "[ERROR] 'make' not found and cannot install it (not root or no apt-get)."
                        exit 1
                      fi
                    fi

                    echo "[+] Installing Node dependencies..."
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
