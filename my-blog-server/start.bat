@echo off
echo Starting My Blog Server...
echo.

echo Checking Java version...
java -version
echo.

echo Building project...
call mvn clean compile
if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Starting application...
call mvn spring-boot:run

pause
