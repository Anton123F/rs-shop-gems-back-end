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
aws dynamodb put-item --table-name %table% --item "{\"id\": {\"S\": \"101\"}, \"title\": {\"S\": \"Diamond\"}, \"price\": {\"N\": \"10\"}, \"description\": {\"S\": \"Brilliant, hardest known natural material.\"}, \"imageURL\": {\"S\": \"https://images.pexels.com/photos/18451700/pexels-photo-18451700.jpeg?auto=compress^&cs=tinysrgb^&w=1260^&h=750^&dpr=1\"}}" %endpoint% --region us-east-1
aws dynamodb put-item --table-name %table% --item "{\"id\": {\"S\": \"102\"}, \"title\": {\"S\": \"Ruby\"}, \"price\": {\"N\": \"20\"}, \"description\": {\"S\": \"Bright red, symbolizes love and passion.\"}, \"imageURL\": {\"S\": \"https://images.pexels.com/photos/12002673/pexels-photo-12002673.jpeg?auto=compress^&cs=tinysrgb^&w=1260^&h=750^&dpr=1\"}}" %endpoint% --region us-east-1
aws dynamodb put-item --table-name %table% --item "{\"id\": {\"S\": \"103\"}, \"title\": {\"S\": \"Emerald\"}, \"price\": {\"N\": \"30\"}, \"description\": {\"S\": \"Vibrant green, represents rebirth and wealth\"}, \"imageURL\": {\"S\": \"https://images.pexels.com/photos/21235148/pexels-photo-21235148.jpeg?auto=compress^&cs=tinysrgb^&w=1260^&h=750^&dpr=1\"}}" %endpoint% --region us-east-1
pause