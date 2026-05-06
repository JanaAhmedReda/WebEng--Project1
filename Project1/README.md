# Pet Shelter Management System

A full-stack web application for managing pet shelters, built with **React + Axios** frontend and **ASP.NET Core + PostgreSQL** backend. The system allows users to register, manage pets, shelters, and adoption applications with comprehensive role-based access control.


---

## Application Overview

### What is This?

The Pet Shelter Management System is a complete web application that enables:

- **Users** to browse available pets, view shelters, and submit adoption applications
- **Employees** to create and manage pets and shelters
- **Admins** to approve/deny role requests, manage users, and oversee all operations

### Key Capabilities

✅ User registration and login with cookie-based authentication  
✅ Browse pets with search functionality  
✅ View shelter information and available pets  
✅ Submit and manage adoption applications  
✅ Admin role request approval system  
✅ Role-based access control (User, Employee, Admin)  
✅ Complete CRUD operations for all models  
✅ Professional error handling and validation  
✅ Responsive design with Bootstrap 5  

---

## Technology Stack

### Frontend
- **React 18** - UI library with functional components
- **React Router v6** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **Bootstrap 5** - Responsive UI framework
- **Vite** - Fast build tool and dev server

### Backend
- **ASP.NET Core 10.0** - Web API framework
- **Entity Framework Core 10.0.4** - ORM for database operations
- **PostgreSQL 15** - Relational database
- **ASP.NET Identity** - User authentication and authorization
- **JWT Bearer** - Token-based authentication
- **Hangfire** - Background job scheduling (optional)
- **Swagger/OpenAPI** - API documentation

---

## Features

### Frontend Features
- **Seamless Navigation** - Single Page Application with React Router
- **Protected Routes** - Role-based access control for all pages
- **Form Validation** - Client-side validation with server error feedback
- **State Management** - React hooks (useState, useEffect) with Context API
- **Session Persistence** - Automatic login restoration via cookies
- **Responsive Design** - Works on desktop, tablet, and mobile

### Backend Features
- **Secure Authentication** - Cookie-based JWT token storage
- **Role-Based Authorization** - Fine-grained permission control
- **CRUD Operations** - Complete data management for all models
- **Entity Relationships** - One-to-One, One-to-Many, and Many-to-Many
- **Data Validation** - Input validation with DataAnnotations
- **Error Handling** - Comprehensive error responses with meaningful messages
- **Database Migrations** - Version-controlled schema management

## Running the Project

This project consists of two separate applications that work together:

### Prerequisites (Global)
- **.NET 10.0 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/10.0)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **PostgreSQL 15+** - [Download here](https://www.postgresql.org/download/) or use Docker
- **Visual Studio Code** or **Visual Studio 2022** (optional but recommended)

### Option 1: Using Docker for PostgreSQL
```bash
docker run --name postgres-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=my_database \
  -p 5433:5432 \
  -d postgres:15
```

---

## Frontend Setup (React + Vite)

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

**Note:** The frontend is configured to proxy API requests to `http://localhost:5081` (backend). Make sure the backend is running before testing API calls.

### 4. Build for Production
```bash
npm run build
```

Output will be in `frontend/dist/` - ready for deployment.

---

## Backend Setup (ASP.NET Core)
### 1. Navigate to Backend Directory
```bash
cd Project1
```

### 2. Restore NuGet Dependencies
```bash
dotnet restore
```

### 3. Configure Database Connection

Update `appsettings.json` with your PostgreSQL connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5433;Database=my_database;Username=postgres;Password=password"
  },
  "Jwt": {
    "Key": "YourSecureKeyAtLeast32CharactersLong!!!",
    "Issuer": "PetShelterAPI",
    "Audience": "PetShelterUsers"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  }
}
```

**Important:** Update the values to match your PostgreSQL setup:
- `Host` - PostgreSQL server address (localhost or 127.0.0.1)
- `Port` - PostgreSQL port (default 5432, Docker example uses 5433)
- `Database` - Database name (my_database)
- `Username` - PostgreSQL username (default: postgres)
- `Password` - PostgreSQL password (change from "password" to your actual password)

### 4. Apply Database Migrations
```bash
dotnet ef database update
```

This will:
- Create all database tables
- Set up relationships
- Initialize default roles (User, Employee, Admin)

### 5. Run the Backend
```bash
dotnet run --urls http://localhost:5081
```

The backend will be available at: `http://localhost:5081`

**Features available:**
- Swagger UI: `http://localhost:5081/swagger`
- Health check: `http://localhost:5081/health`
- API endpoints: `http://localhost:5081/api/*`

---

## Complete Startup Guide (Terminal)

### Terminal 1: Start PostgreSQL (if using Docker)
```bash
docker start postgres-db
```

### Terminal 2: Start Backend
```bash
cd Project1
dotnet run --urls http://localhost:5081
```

Wait for: `Now listening on: http://localhost:5081`

### Terminal 3: Start Frontend
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173`

**Now:**
- Frontend available at: `http://localhost:5173`
- Backend available at: `http://localhost:5081`
- Swagger docs at: `http://localhost:5081/swagger`

Open `http://localhost:5173` in your browser and start using the application!

## API Routes Reference

All API endpoints are prefixed with `/api`. The frontend communicates with these endpoints via Axios.

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/auth/register` | Register a new user account | ❌ | - |
| POST | `/auth/login` | Login with email & password | ❌ | - |
| GET | `/auth/me` | Get current user session | ✅ | All |
| POST | `/auth/logout` | Logout (clear session) | ✅ | All |
| GET | `/auth/role-requests` | Get pending role upgrade requests | ✅ | Admin only |
| POST | `/auth/approve-role/{userId}` | Approve role request for user | ✅ | Admin only |
| POST | `/auth/deny-role/{userId}` | Deny role request for user | ✅ | Admin only |

### Pet Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|----------------|-------|
| GET | `/pets` | Get all pets | ✅ | User, Employee, Admin |
| GET | `/pets/{id}` | Get pet by ID | ✅ | User, Employee, Admin |
| POST | `/pets` | Create new pet | ✅ | Employee, Admin |
| PUT | `/pets/{id}` | Update pet information | ✅ | Employee, Admin |
| DELETE | `/pets/{id}` | Delete pet | ✅ | Admin only |

**Pet Model Fields:**
- `id` - Unique identifier
- `name` - Pet name
- `breed` - Pet breed
- `age` - Pet age (numeric)
- `ageUnit` - Age unit (Years, Months, Weeks)
- `shelterId` - Associated shelter
- `shelterName` - Shelter name (read-only)
- `healthNotes` - Health information
- `isVaccinated` - Vaccination status (boolean)

### Shelter Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|----------------|-------|
| GET | `/shelters` | Get all shelters | ✅ | User, Employee, Admin |
| GET | `/shelters/{id}` | Get shelter by ID | ✅ | User, Employee, Admin |
| GET | `/shelters/{id}/pets` | Get all pets in shelter | ✅ | User, Employee, Admin |
| POST | `/shelters` | Create new shelter | ✅ | Employee, Admin |
| PUT | `/shelters/{id}` | Update shelter information | ✅ | Employee, Admin |
| DELETE | `/shelters/{id}` | Delete shelter | ✅ | Admin only |

**Shelter Model Fields:**
- `id` - Unique identifier
- `name` - Shelter name
- `address` - Shelter address

### Adoption Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|----------------|-------|
| POST | `/adoptions/apply` | Submit adoption application | ✅ | User, Employee, Admin |
| GET | `/adoptions/all` | Get all applications | ✅ | Employee, Admin |
| GET | `/adoptions/pet/{petId}` | Get applications for pet | ✅ | Employee, Admin |
| GET | `/adoptions/user/{userId}` | Get user's applications | ✅ | User, Employee, Admin |
| PUT | `/adoptions/status` | Update application status | ✅ | Employee, Admin |
| DELETE | `/adoptions/{petId}/{userId}` | Delete application | ✅ | Employee, Admin |

**Adoption Model Fields:**
- `userId` - User who applied
- `petId` - Pet being applied for
- `petName` - Pet name (read-only)
- `adopterName` - Adopter full name
- `applicationDate` - Date of application
- `status` - Application status (Pending, Approved, Rejected)

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|----------------|-------|
| GET | `/users` | Get all users | ✅ | Admin only |
| GET | `/users/{id}` | Get user by ID | ✅ | Admin only |
| POST | `/users/{userId}/assign-role` | Assign role to user | ✅ | Admin only |
| DELETE | `/users/{id}` | Delete user account | ✅ | Admin only |

---

## API Request/Response Examples

### Register User
**Request:**
```json
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "555-1234",
  "role": "User"
}
```

**Response (201 Created):**
```json
{
  "id": "user-123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["User"]
}
```

### Login User
**Request:**
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "id": "user-123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["User"]
}
```
*JWT token stored in HTTP-only cookie automatically*

### Create Pet
**Request:**
```json
POST /api/pets
{
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age": 3,
  "ageUnit": "Years",
  "shelterId": 1,
  "healthNotes": "Fully vaccinated and healthy",
  "isVaccinated": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age": 3,
  "ageUnit": "Years",
  "shelterId": 1,
  "shelterName": "Main Shelter",
  "healthNotes": "Fully vaccinated and healthy",
  "isVaccinated": true
}
```

### Submit Adoption Application
**Request:**
```json
POST /api/adoptions/apply
{
  "petId": 1,
  "adopterName": "John Doe"
}
```

**Response (201 Created):**
```json
{
  "userId": "user-123",
  "petId": 1,
  "petName": "Buddy",
  "adopterName": "John Doe",
  "applicationDate": "2026-05-05T10:30:00Z",
  "status": "Pending"
}
```

---

## Role-Based Access Control

### User Roles
Three roles control what users can do:

| Action | User | Employee | Admin |
|--------|------|----------|-------|
| View Pets | ✅ | ✅ | ✅ |
| Create Pet | ❌ | ✅ | ✅ |
| Edit Pet | ❌ | ✅ | ✅ |
| Delete Pet | ❌ | ❌ | ✅ |
| View Shelters | ✅ | ✅ | ✅ |
| Create Shelter | ❌ | ✅ | ✅ |
| Edit Shelter | ❌ | ✅ | ✅ |
| Delete Shelter | ❌ | ❌ | ✅ |
| Apply for Adoption | ✅ | ✅ | ✅ |
| View All Applications | ❌ | ✅ | ✅ |
| Update Application Status | ❌ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| Approve Role Requests | ❌ | ❌ | ✅ |

### Role Request Process
1. New user registers with "Employee" or "Admin" as requested role
2. User account created with "User" role
3. Requested role stored in `RequestedRole` field
4. Admin views pending requests in Role Requests page
5. Admin approves/denies request
6. User is promoted or request is cleared

---

## Frontend Routes

The React frontend has these main routes:

| Route | Purpose | Auth Required | Roles |
|-------|---------|----------------|-------|
| `/` | Home page | ❌ | - |
| `/login` | Login page | ❌ | - |
| `/register` | Registration page | ❌ | - |
| `/pets` | View all pets | ✅ | User+ |
| `/pets/new` | Create pet form | ✅ | Employee+ |
| `/pets/:id` | Pet details | ✅ | User+ |
| `/pets/:id/edit` | Edit pet form | ✅ | Employee+ |
| `/shelters` | View all shelters | ✅ | User+ |
| `/shelters/new` | Create shelter form | ✅ | Employee+ |
| `/shelters/:id` | Shelter details | ✅ | User+ |
| `/shelters/:id/edit` | Edit shelter form | ✅ | Employee+ |
| `/adoptions` | View applications (staff) | ✅ | Employee+ |
| `/adoptions/new` | Submit application (user) | ✅ | User+ |
| `/admin/users` | User management | ✅ | Admin |
| `/admin/role-requests` | Manage role requests | ✅ | Admin |

---

## API Documentation

### Interactive API Testing

Access the Swagger UI for interactive API testing:
- **URL:** `http://localhost:5081/swagger`
- **Features:**
  - Test all endpoints directly from browser
  - View request/response schemas
  - Authenticate with JWT token
  - See live responses

### Using Postman

Import the provided Postman collection `PetShelterAPI.json`:

1. Open Postman
2. Click "Import"
3. Select `PetShelterAPI.json`
4. Set environment variables:
   - `base_url` = `http://localhost:5081/api`
   - `token` = (automatically populated after login)
5. Run requests and test endpoints

---

## Database Schema

### Users Table (AspNetUsers)
```
- Id (Primary Key)
- Email
- FirstName
- LastName
- PhoneNumber
- RequestedRole (for pending role upgrades)
- PasswordHash
- Created/Updated timestamps
```

### Roles Table (AspNetRoles)
```
- Id (Primary Key)
- Name (User, Employee, Admin)
```

### Pets Table
```
- Id (Primary Key)
- Name
- Breed
- Age
- AgeUnit (Years, Months, Weeks)
- ShelterId (Foreign Key)
- HealthNotes
- IsVaccinated
- Created/Updated timestamps
```

### Shelters Table
```
- Id (Primary Key)
- Name
- Address
- Created/Updated timestamps
```

### AdoptionApplications Table
```
- UserId (Foreign Key)
- PetId (Foreign Key)
- AdopterName
- ApplicationDate
- Status (Pending, Approved, Rejected)
```

### Relationships
- **One-to-Many:** Shelter → Pets
- **Many-to-Many:** Users → Pets (via AdoptionApplications)
- **One-to-One:** Pet → PetProfile (health details)

---

## Error Handling

The API returns meaningful error responses:

### 400 Bad Request
Validation error - Invalid input data
```json
{
  "errors": {
    "email": ["Email is required", "Invalid email format"]
  }
}
```

### 401 Unauthorized
Missing or invalid authentication
```json
{
  "error": "Unauthorized - Please log in"
}
```

### 403 Forbidden
Authenticated but insufficient permissions
```json
{
  "error": "Access denied - Admin role required"
}
```

### 404 Not Found
Resource does not exist
```json
{
  "error": "Pet not found"
}
```

### 500 Internal Server Error
Server error - Check logs
```json
{
  "error": "An unexpected error occurred"
}
```

---

## Troubleshooting

### "Unable to connect to database"
- Ensure PostgreSQL is running
- Check connection string in `appsettings.json`
- Verify database name and credentials

### "Unauthorized" on API calls
- Ensure you're logged in
- Check that JWT cookie is being sent
- Clear browser cookies and log in again

### Frontend not connecting to backend
- Confirm backend is running on `http://localhost:5081`
- Check browser console for CORS errors
- Verify `withCredentials: true` in Axios config

### Migration errors
- Drop database: `dotnet ef database drop`
- Reapply migrations: `dotnet ef database update`
- Or recreate database in PostgreSQL manually

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Loading.jsx      # Loading spinner
│   │   ├── NavBar.jsx       # Navigation bar
│   │   ├── NotFound.jsx     # 404 page
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── admin/
│   │   ├── auth/            # Login, Register
│   │   ├── pets/            # Pet CRUD pages
│   │   ├── shelters/        # Shelter CRUD pages
│   │   └── adoptions/       # Adoption pages
│   ├── services/            # API communication
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js
│   │   ├── petService.js
│   │   ├── shelterService.js
│   │   └── adoptionService.js
│   ├── hooks/
│   │   └── useAuth.jsx      # Authentication hook
│   ├── utils/               # Helper functions
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/                  # Static files
├── package.json
├── vite.config.js
└── index.html
```

### Backend Structure
```
Project1/
├── Controllers/             # API endpoints
│   ├── AuthController.cs    # Login, register, roles
│   ├── PetController.cs     # Pet CRUD
│   ├── ShelterController.cs # Shelter CRUD
│   └── AdoptionController.cs # Adoption CRUD
├── Models/                  # Entity classes
│   ├── ApplicationUser.cs
│   ├── Pet.cs
│   ├── Shelter.cs
│   ├── AdoptionApplication.cs
│   └── PetProfile.cs
├── DTOs/                    # Request/Response DTOs
│   ├── CreatePetDto.cs
│   ├── UpdatePetDto.cs
│   ├── LoginModelDto.cs
│   └── ... (other DTOs)
├── Services/                # Business logic
│   ├── PetService.cs
│   ├── ShelterService.cs
│   └── AdoptionService.cs
├── Interfaces/              # Service contracts
│   ├── IPetService.cs
│   ├── IShelterService.cs
│   └── IAdoptionService.cs
├── Database/
│   └── ApplicationDbContext.cs
├── Migrations/              # EF Core migrations
├── appsettings.json
├── Program.cs
└── README.md
```

---

## Development Workflow

### Making Changes

#### Backend Changes
1. Make code changes in the `Project1` folder
2. Build: `dotnet build`
3. Run: `dotnet run --urls http://localhost:5081`
4. Test in Swagger UI: `http://localhost:5081/swagger`

#### Frontend Changes
1. Make code changes in the `frontend` folder
2. Vite automatically reloads during development
3. Open `http://localhost:5173` in browser
4. Check browser console for errors

### Database Changes
1. Modify Entity models in `Project1/Models/`
2. Create migration: `dotnet ef migrations add MigrationName`
3. Apply migration: `dotnet ef database update`
4. Changes are reflected in PostgreSQL database

---

## Key Features Implementation

### Authentication Flow
```
User Registration
   ↓
[POST] /api/auth/register
   ↓
User Account Created (with "User" role)
   ↓
RequestedRole stored (Employee/Admin)
   ↓
Admin Approves
   ↓
[POST] /api/auth/approve-role
   ↓
User Promoted to Employee/Admin
```

### Cookie Security
- JWT token stored in **HTTP-only cookie** (cannot be accessed by JavaScript)
- **Secure flag** set (only sent over HTTPS in production)
- **SameSite** attribute prevents CSRF attacks
- Frontend uses Axios with `withCredentials: true`

### Protected Routes (Frontend)
```javascript
<ProtectedRoute allowedRoles={["Admin"]}>
  <AdminPanel />
</ProtectedRoute>
```
- Checks if user is authenticated
- Validates user has required role
- Redirects to login if not authenticated
- Redirects to fallback URL if insufficient permissions

---

## Testing Scenarios

### Basic User Flow
1. **Register** - `http://localhost:5173/register`
   - Fill form with User role
   - Verify account created

2. **Login** - `http://localhost:5173/login`
   - Use registered credentials
   - Verify redirected to home

3. **Browse Pets** - `http://localhost:5173/pets`
   - View all pets
   - Click on pet for details
   - Search by pet ID

4. **Apply for Adoption** - `http://localhost:5173/adoptions/new`
   - Select pet from dropdown
   - Fill adopter name
   - Submit application

### Employee Flow
1. Register with "Employee" role
2. Admin approves role request
3. Login with employee account
4. Create new pet: `http://localhost:5173/pets/new`
5. Create new shelter
6. View adoption applications: `http://localhost:5173/adoptions`
7. Update application status

### Admin Flow
1. Register with "Admin" role
2. Admin self-approves (if using test database)
3. Login with admin account
4. View role requests: `http://localhost:5173/admin/role-requests`
5. Approve/deny pending requests
6. Manage users: `http://localhost:5173/admin/users`
7. Full CRUD permissions on all resources

---

## Performance Considerations

### Frontend Optimization
- Code splitting with React lazy loading
- Request/response logging can be disabled for production
- localStorage for session persistence (no extra API calls on reload)
- Axios interceptors for consistent error handling

### Backend Optimization
- Entity Framework Core `.AsNoTracking()` for read operations
- `.Select()` projections to fetch only needed fields
- Hangfire for background jobs (scheduled cleanups)
- Database indexes on frequently queried fields

---

## Security Practices

✅ **Password Security**
- BCrypt hashing with salt via ASP.NET Identity
- Password strength requirements enforced
- No passwords stored in plain text

✅ **Authentication**
- JWT tokens issued after successful login
- Stored in HTTP-only cookies (prevent XSS)
- Automatic validation on protected endpoints

✅ **Authorization**
- Role-based access control (User, Employee, Admin)
- Endpoint checks for required roles
- Frontend route guards prevent unauthorized access

✅ **Data Validation**
- Server-side validation on all inputs
- DataAnnotations for model validation
- API returns meaningful error messages

✅ **CORS Security**
- Backend configured for same-origin requests
- Frontend configured with credentials

---

## Frequently Asked Questions

### Q: What if I forget my password?
Currently, there's no password reset functionality. Delete your user account and re-register. In production, this would include email verification.

### Q: Can users request role changes?
Yes! During registration, select "Employee" or "Admin" as the requested role. Admins must approve the request before the role is assigned.

### Q: How long does a session last?
Sessions persist as long as the browser cookie is valid. Log out to clear the session, or clear browser cookies to force re-authentication.

### Q: What happens if the backend is down?
The frontend will show API error messages. Ensure the backend is running on `http://localhost:5081` before using the application.

### Q: Can I modify the adoption application?
No, once submitted, applications cannot be edited. They can only be deleted by staff. This ensures application integrity.

### Q: Are there any automated features?
Yes, Hangfire handles background jobs like scheduled cleanups. Configure in `appsettings.json` if needed.

---

## Support & Contact

For issues, questions, or improvements:

1. **Check this README** - Most setup issues are covered
2. **Review browser console** - Frontend errors logged here
3. **Check terminal output** - Backend errors logged here
4. **Test in Swagger UI** - `http://localhost:5081/swagger`
5. **Check database connection** - Ensure PostgreSQL is running

---

## License

This project is part of the Web Engineering course assignment. All rights reserved.

---

**Last Updated:** May 5, 2026  
**Version:** 1.0.0 (Production Ready)  
**Status:** ✅ Complete & Tested

---

### Quick Links
- 📖 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - API reference and common tasks
- 📋 [REQUIREMENTS_MAPPING.md](REQUIREMENTS_MAPPING.md) - Requirement fulfillment details
- 🎓 [AI_USAGE.md](AI_USAGE.md) - AI assistance documentation
- 📸 [Screenshots folder](screenshots/) - Visual documentation

**Note**: If submitting via Google Classroom, provide only the repository link, not a ZIP file.
