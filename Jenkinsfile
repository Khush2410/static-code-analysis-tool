pipeline {
    agent any

    options {
        // Keeps the build history cleaner on GitHub
        skipDefaultCheckout true
    }

    triggers {
        // This is the correct way to define the trigger
        GenericTrigger(
            genericVariables: [
                [key: 'ref', value: '$.ref'],
                [key: 'head_sha', value: '$.pull_request.head.sha'],
                [key: 'pr_number', value: '$.number'],
                [key: 'action', value: '$.action']
            ],
            // This token MUST match the one in your GitHub webhook URL
            token: 'a-very-secret-string',
            // Filter for PR events only
            causeString: 'Triggered by GitHub PR #${pr_number}',
            printPostContent: true,
            printContributedVariables: true,
            // Trigger on PR open or code changes
            regexpFilterText: '$action',
            regexpFilterExpression: '^(opened|reopened|synchronize)$'
        )
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Manually checkout the PR branch
                checkout scm
                // Update the build status to "pending" on GitHub
                updateGitlabCommitStatus name: 'ESLint-Check', state: 'pending'
            }
        }

        stage('Run ESLint CI') {
            steps {
                script {
                    try {
                        // Your build command from the Makefile
                        sh 'make ci'
                        // If 'make ci' succeeds, update status to "success"
                        updateGitlabCommitStatus name: 'ESLint-Check', state: 'success'
                    } catch (Exception e) {
                        // If 'make ci' fails, update status to "failed"
                        updateGitlabCommitStatus name: 'ESLint-Check', state: 'failed'
                        // Fail the pipeline
                        error "ESLint checks failed: ${e.getMessage()}"
                    }
                }
            }
        }
    }
}