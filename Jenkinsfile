pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "sudo npm install"
                sh "sudo npm run build"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo rm -rf -S /var/www/ramble-client"
                sh "sudo cp -r -S ${WORKSPACE}/build/ /var/www/ramble-client/"
            }
        }
    }
}