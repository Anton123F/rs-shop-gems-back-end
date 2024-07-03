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
set table=stocks
@echo off
aws dynamodb put-item --table-name stocks --item "{\"id\": {\"S\": \"1\"}, \"product_id\": {\"S\": \"101\"}, \"count\": {\"N\": \"10\"}}" %endpoint% --region us-east-1
aws dynamodb put-item --table-name stocks --item "{\"id\": {\"S\": \"2\"}, \"product_id\": {\"S\": \"102\"}, \"count\": {\"N\": \"5\"}}" %endpoint% --region us-east-1
aws dynamodb put-item --table-name stocks --item "{\"id\": {\"S\": \"3\"}, \"product_id\": {\"S\": \"103\"}, \"count\": {\"N\": \"17\"}}" %endpoint% --region us-east-1
pause