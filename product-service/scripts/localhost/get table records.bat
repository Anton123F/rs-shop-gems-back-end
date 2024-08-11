@echo off
set /p table="Enter table name: "
aws dynamodb scan --table-name %table% --endpoint-url http://localhost:8000 --region us-east-1
pause