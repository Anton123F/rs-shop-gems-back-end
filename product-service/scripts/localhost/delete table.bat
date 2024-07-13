@echo off
:begin
set /p table="Enter table name to delete: "
aws dynamodb delete-table --table-name %table% --endpoint-url http://localhost:8000 --region us-east-1
echo.
echo 1. Go back
echo 2. Exit
echo.
set /p option="Choose an option (1 or 2): "
if "%option%"=="1" (
    goto begin
) else if "%option%"=="2" (
    exit
) else (
    echo Invalid option
)
pause