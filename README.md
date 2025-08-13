# AUSY EXPO - Garment Export Management System

A comprehensive software system for AUSY EXPO garment export company with role-based access control, featuring React.js frontend with Tailwind CSS and Spring Boot backend with MySQL database.

## Features

### User Roles
- **Admin**: System administration, user management, branch management, view reports
- **Owner**: Business management, user activation, branch oversight, command distribution
- **Manager**: Branch operations, employee management, inventory control
- **Supplier**: Supply management, order tracking, payment history
- **Buyer**: Product browsing, order placement, order tracking

### Key Functionalities
- Multi-role dashboard system
- Dark/Light theme toggle
- JWT-based authentication
- MySQL database integration
- Responsive design with Tailwind CSS
- Real-time data management
- Report generation capabilities

## Technology Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- Headless UI components

### Backend
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- MySQL Database
- JWT Authentication
- Maven

## Project Structure

```
AUSY_SEMI/
├── backend/
│   ├── src/main/java/com/ausyexpo/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── pom.xml
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── services/
    └── package.json
```

## Database Setup

1. Install MySQL Server
2. Create a database named `ausy_semi`
3. Update the database credentials in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

## Running the Application

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- MySQL Server
- Maven

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

   The backend will start on `http://localhost:8080`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## Default Credentials

### Admin Access
- **Email**: admin@ausyexpo.com
- **Password**: admin123

The admin user is automatically created when the backend starts.

## Database Schema

The application will automatically create the following tables:
- `users` - All user accounts (Admin, Owner, Manager, Supplier, Buyer)
- `branches` - Company branch information
- `employees` - Employee records per branch
- `departments` - Department structure per branch
- `salaries` - Employee salary details
- `stock` - Inventory management
- `transportation` - Vehicle fleet management
- `supply` - Supply chain records

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration (Manager, Supplier, Buyer only)

### User Management
- `GET /api/users` - Get all users (Admin/Owner)
- `POST /api/users` - Create user (Admin/Owner)
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user
- `PUT /api/users/{id}/activate` - Activate user account

## Role-Based Features

### Admin
- Add new users (Owner accounts)
- View system-wide reports
- Manage all branches
- System administration

### Owner
- CRUD operations on user management
- Manage branches
- Activate Manager/Supplier/Buyer accounts
- Give commands to managers
- View all reports

### Manager
- Manage employees in assigned branch
- Handle salary details
- Manage departments
- Stock management
- Transportation management
- Supply management

### Supplier
- Manage supply catalog
- Track orders
- Payment history

### Buyer
- Browse products
- Place orders
- Track order history

## Development Notes

### Theme System
The application supports dark/light mode toggle with persistent storage.

### Security
- JWT tokens for authentication
- Role-based access control
- Password encryption with BCrypt
- CORS configuration for frontend integration

### Database Design
- Automatic schema generation
- Entity relationships with proper foreign keys
- Audit fields (created_at, updated_at)
- Calculated fields (final salary)

## Future Enhancements

- Report generation with charts using Recharts
- Real-time notifications
- Email integration
- File upload functionality
- Advanced filtering and search
- Export capabilities (PDF, Excel)
- Multi-language support

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Backend: Change port in `application.properties`
   - Frontend: Set different port with `PORT=3001 npm start`

2. **Database connection issues**:
   - Verify MySQL is running
   - Check database credentials
   - Ensure database `ausy_semi` exists

3. **CORS errors**:
   - Verify frontend URL in backend CORS configuration
   - Check API base URL in frontend service

## License

This project is developed for AUSY EXPO company as a comprehensive garment export management solution.

## Support

For technical support or questions, please contact the development team.
