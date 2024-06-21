@echo off
echo Choose DynamoDB instance:
echo 1. Local
echo 2. Global
set /p choice="Enter your choice (1 or 2): "
if %choice%==1 (
    set endpoint=--endpoint-url http://localhost:8000
) else (
    set endpoint=
)
set table=products
@echo off
aws dynamodb put-item --table-name %table% --item "{\"id\": {\"S\": \"101\"}, \"title\": {\"S\": \"Diamond\"}, \"price\": {\"N\": \"10\"}, \"description\": {\"S\": \"Brilliant, hardest known natural material.\"}}" %endpoint% --region us-east-1
aws dynamodb put-item --table-name %table% --item "{\"id\": {\"S\": \"102\"}, \"title\": {\"S\": \"Ruby\"}, \"price\": {\"N\": \"20\"}, \"description\": {\"S\": \"Bright red, symbolizes love and passion.\"}}" %endpoint% --region us-east-1
aws dynamodb put-item --table-name %table% --item "{\"id\": {\"S\": \"103\"}, \"title\": {\"S\": \"Emerald\"}, \"price\": {\"N\": \"30\"}, \"description\": {\"S\": \"Vibrant green, represents rebirth and wealth\"}}" %endpoint% --region us-east-1
pause