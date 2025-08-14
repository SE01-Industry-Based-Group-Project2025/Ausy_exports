# How to Start the AUSY EXPO Backend Server

## The Issue
You're getting "Failed to fetch employees: Failed to fetch" because the backend server is not running.

## Solutions (Try in order)

### Option 1: Run from VS Code (Recommended)
1. Open VS Code
2. Open the folder: `c:\Users\pc\Desktop\AUSY_SEMI\Ausy_exports\backend`
3. Install the "Extension Pack for Java" if not already installed
4. Navigate to: `src/main/java/com/ausyexpo/AusyExpoBackendApplication.java`
5. Right-click on the file and select "Run Java" or click the "Run" button above the main method
6. Wait for the server to start (you'll see "Started AusyExpoBackendApplication" in the terminal)

### Option 2: Run from Command Line (if Maven works)
1. Open PowerShell or Command Prompt
2. Navigate to: `cd "c:\Users\pc\Desktop\AUSY_SEMI\Ausy_exports\backend"`
3. Run: `mvn spring-boot:run`

### Option 3: Run the batch file
1. Double-click on `start-backend.bat` in the backend folder
2. Follow the instructions if Maven fails

### Option 4: Use IntelliJ IDEA or Eclipse
1. Import the project into your IDE
2. Find the main class: `AusyExpoBackendApplication.java`
3. Run the main method

## How to know it's working
When the backend starts successfully, you should see:
```
Started AusyExpoBackendApplication in X.XXX seconds (JVM running for X.XXX)
```

The server will be running on: http://localhost:8080

## Then test the frontend
1. Navigate to: `cd "c:\Users\pc\Desktop\AUSY_SEMI\Ausy_exports\frontend"`
2. Run: `npm start`
3. Open browser to: http://localhost:3000
4. Login as manager and go to Employee Management

## Troubleshooting
- Make sure port 8080 is not used by another application
- Check if MySQL is running (the backend needs a database)
- Verify the database configuration in `src/main/resources/application.properties`
