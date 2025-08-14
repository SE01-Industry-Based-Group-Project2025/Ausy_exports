Write-Host "Starting AUSY EXPO Backend..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure you have compiled the project first in your IDE" -ForegroundColor Yellow
Write-Host ""

Set-Location $PSScriptRoot

# Try to run using Maven first
Write-Host "Attempting to start with Maven..." -ForegroundColor Cyan
try {
    mvn spring-boot:run
} catch {
    Write-Host ""
    Write-Host "Maven failed. Please follow these steps:" -ForegroundColor Red
    Write-Host ""
    Write-Host "1. Open this project in VS Code or IntelliJ IDEA" -ForegroundColor White
    Write-Host "2. Make sure you have Java extension installed in VS Code" -ForegroundColor White
    Write-Host "3. Right-click on AusyExpoBackendApplication.java and select 'Run Java'" -ForegroundColor White
    Write-Host "4. Or open a terminal in VS Code and run:" -ForegroundColor White
    Write-Host "   java -cp target/classes com.ausyexpo.AusyExpoBackendApplication" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Alternative: If you have an IDE, run the main method in AusyExpoBackendApplication.java" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to continue"
}
