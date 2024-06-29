@echo off
REM Start the Docker container
docker run -p 8000:8000 amazon/dynamodb-local

REM Wait for a few seconds to make sure the container is up and running
timeout /t 5 /nobreak >nul

REM Run the AWS CLI command
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1

pause