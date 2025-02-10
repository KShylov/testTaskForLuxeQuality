pipeline {
    agent any

    tools {
        nodejs 'NodeJS_23.7.0' // Здесь указываешь установленную версию
    }

    stages {
        stage('Debug Params') {
            steps {
                script {
                    echo "Run tests webdriverio"
                }
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
             steps {
                 script {
                     try {
                         sh 'npx wdio run ./wdio.conf.js'
                     } catch (e) {
                         currentBuild.result = 'FAILURE'
                         throw e // Переходим к следующей стадии, если ошибка произошла
                     }
                 }
             }
        }
    }
}