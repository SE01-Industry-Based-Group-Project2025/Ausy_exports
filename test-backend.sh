#!/bin/bash
echo "Employee Management Backend Test"
echo "================================"
echo ""

# Check if Java is available
echo "1. Checking Java..."
java -version
echo ""

# Check if backend is running
echo "2. Checking if backend is running on port 8080..."
netstat -an | grep :8080 || echo "Port 8080 is not in use - backend is not running"
echo ""

# Instructions
echo "3. To start the backend:"
echo "   Option A: In VS Code, run AusyExpoBackendApplication.java"
echo "   Option B: In terminal, cd to backend folder and run: mvn spring-boot:run"
echo "   Option C: In IDE, run the main method in AusyExpoBackendApplication.java"
echo ""

echo "4. Once backend starts, you should see:"
echo "   'Started AusyExpoBackendApplication in X.XXX seconds'"
echo ""

echo "5. Then test employee management at:"
echo "   http://localhost:3000/dashboard/employees"
