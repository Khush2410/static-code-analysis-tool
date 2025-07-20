pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Set pending status at the start of the build
                    // Using currentBuild.rawBuild.commitId for the specific commit SHA
                    // context and targetUrl define what shows up on GitHub
                    // This usually needs the credentialsId of your GitHub token
                    //
                    // Ensure your job configuration or SCM checkout provides env.GIT_COMMIT or similar
                    // if you don't use a dedicated "Build status" configuration in the job UI
                    // For a simple setup with a single credential, Jenkins often infers it.
                    try {
                        // Option 1: Using the more generic GitHubCommitStatusSetter (recommended)
                        step([$class: 'GitHubCommitStatusSetter',
                            context: env.JOB_NAME, // Or a custom name like 'CI/ESLint-Check'
                            errorHandlers: [[$class: 'ChangingBuildStatusErrorHandler', result: 'UNSTABLE']],
                            reposSource: [$class: 'AnyDefinedRepositorySource'], // Or ManuallyEnteredRepositorySource for a specific URL
                            statusResultSource: [$class: 'ManuallyEnteredStatusResultSource',
                                message: "Jenkins build started for ${env.BUILD_DISPLAY_NAME}",
                                state: "PENDING",
                                url: env.BUILD_URL
                            ]
                        ])
                    } catch (Exception e) {
                        echo "Could not set GitHub status to PENDING: ${e.getMessage()}"
                    }
                }
                checkout scm // Your existing checkout step
            }
        }

        stage('Run ESLint CI') {
            steps {
                script {
                    try {
                        // Your ESLint command (see "Alternative for make: not found" below)
                        sh 'npm install' // Assuming you have package.json and npm
                        sh 'npm run ci'  // Assuming you have a "ci" script in package.json
                        // or direct eslint command: sh 'npx eslint .'
                    } catch (Exception e) {
                        // Set failure status on error
                        step([$class: 'GitHubCommitStatusSetter',
                            context: env.JOB_NAME,
                            errorHandlers: [[$class: 'ChangingBuildStatusErrorHandler', result: 'UNSTABLE']],
                            reposSource: [$class: 'AnyDefinedRepositorySource'],
                            statusResultSource: [$class: 'ManuallyEnteredStatusResultSource',
                                message: "ESLint checks FAILED for ${env.BUILD_DISPLAY_NAME}: ${e.getMessage()}",
                                state: "FAILURE",
                                url: env.BUILD_URL
                            ]
                        ])
                        error "ESLint checks failed: ${e.getMessage()}" // Fail the Jenkins build
                    }
                    // Set success status if everything passes
                    step([$class: 'GitHubCommitStatusSetter',
                        context: env.JOB_NAME,
                        errorHandlers: [[$class: 'ChangingBuildStatusErrorHandler', result: 'UNSTABLE']],
                        reposSource: [$class: 'AnyDefinedRepositorySource'],
                        statusResultSource: [$class: 'ManuallyEnteredStatusResultSource',
                            message: "ESLint checks PASSED for ${env.BUILD_DISPLAY_NAME}",
                            state: "SUCCESS",
                            url: env.BUILD_URL
                        ]
                    ])
                }
            }
        }
    }
    post {
        // Optional: for general build status (SUCCESS/FAILURE/UNSTABLE)
        // You can use the global `githubNotifier` or `setGitHubPullRequestStatus` as well.
        // Refer to the GitHub Plugin documentation for exact syntax.
        always {
             script {
                // This is a simplified approach, the GitHubCommitStatusSetter gives more control
                // This assumes your SCM block sets up GitHub project properties correctly
                // and you've linked the GitHub repo in the job config.
                // This might also require "Set build status on GitHub commit" enabled in job config.
                // See jenkins.io/doc/pipeline/steps/github/ for up-to-date syntax.
                // For example:
                // setGitHubPullRequestStatus(context: env.JOB_NAME, commitId: env.GIT_COMMIT, state: currentBuild.result)
                // Or if using the older GitHubCommitNotifier (often deprecated):
                // githubNotify()
             }
        }
    }
}