@echo off
SETLOCAL EnableDelayedExpansion

echo Choose an option:
echo 1. Localhost
echo 2. Global
set /p choice="Enter your choice (1-2): "

set ENDPOINT=--endpoint-url http://localhost:8000

if "!choice!"=="2" (
    set ENDPOINT=""
)

aws dynamodb create-table ^
     --table-name stocks ^
     --attribute-definitions AttributeName=product_id,AttributeType=S ^
     --key-schema AttributeName=product_id,KeyType=HASH ^
     --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 ^
     !ENDPOINT! ^
     --region us-east-1
pause