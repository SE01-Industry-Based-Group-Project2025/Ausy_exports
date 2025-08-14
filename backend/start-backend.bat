@echo off
echo Starting AUSY EXPO Backend...
echo.
echo Make sure you have compiled the project first in your IDE (VS Code or any Java IDE)
echo.

cd /d "%~dp0"

rem Try to run using Maven first
echo Attempting to start with Maven...
mvn spring-boot:run

rem If Maven fails, provide instructions
if errorlevel 1 (
    echo.
    echo Maven failed. Please follow these steps:
    echo.
    echo 1. Open this project in VS Code or IntelliJ IDEA
    echo 2. Make sure you have Java extension installed in VS Code
    echo 3. Right-click on AusyExpoBackendApplication.java and select "Run Java"
    echo 4. Or open a terminal in VS Code and run: java -cp target/classes com.ausyexpo.AusyExpoBackendApplication
    echo.
    echo Alternative: If you have an IDE, run the main method in AusyExpoBackendApplication.java
    echo.
    pause
)
