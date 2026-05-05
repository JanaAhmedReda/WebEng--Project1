# Pet Shelter Management System - Frontend

A modern React (Vite) application for managing pet adoptions, shelters, and adoption applications. Users can register, log in, browse available pets, view shelter information, and apply for pet adoptions.

## Features

- **User Authentication**: Register and login with secure HTTP-only cookies
- **Pet Management**: Browse, create, edit, and delete pet listings
- **Shelter Management**: View shelters and manage shelter information
- **Adoption System**: Apply for pet adoption, track application status
- **Session Persistence**: Automatic session restoration on page reload
- **Protected Routes**: Unauthorized users are redirected to login
- **Responsive Design**: Bootstrap-based responsive UI

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Backend API running on `http://localhost:5081` (configurable via `.env`)

## Installation & Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5081/api
```

**Note**: Adjust the URL if your backend is running on a different host or port.

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Production-ready files will be generated in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## Backend Setup

Ensure the backend API is running before starting the frontend:

1. Open the backend project in Visual Studio or your IDE
2. Located at: `../Project1/Project1.sln`
3. Press `F5` to run (or use `dotnet run` in the terminal)
4. Backend will start on `https://localhost:5081`

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── NavBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Loading.jsx
│   │   └── NotFound.jsx
│   ├── pages/            # Page components for routes
│   │   ├── Home.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── pets/
│   │   │   ├── PetsList.jsx
│   │   │   ├── PetForm.jsx
│   │   │   └── PetDetails.jsx
│   │   ├── shelters/
│   │   │   ├── SheltersList.jsx
│   │   │   ├── ShelterForm.jsx
│   │   │   └── ShelterDetails.jsx
│   │   └── adoptions/
│   │       ├── AdoptionsList.jsx
│   │       ├── AdoptionForm.jsx
│   │       └── AdoptionDetails.jsx
│   ├── services/         # API service layer
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── petService.js
│   │   ├── shelterService.js
│   │   └── adoptionService.js
│   ├── hooks/            # Custom React hooks
│   │   └── useAuth.jsx
│   ├── utils/            # Utility functions
│   │   ├── validators.js
│   │   └── formatters.js
│   ├── App.jsx           # Main app router
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── public/               # Static files
├── .env                  # Environment variables
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## API Routes Reference

All requests include the `Authorization: Bearer {token}` header (automatic via Axios interceptor).

### Authentication Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login with email/password |
| GET | `/api/auth/me` | Yes | Get current user info |
| POST | `/api/auth/logout` | Yes | Logout (clear auth cookie) |

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "555-1234",
  "password": "SecurePass123!"
}
```

### Pet Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/pets` | Yes | Get all pets |
| GET | `/api/pets/{id}` | Yes | Get pet details |
| POST | `/api/pets` | Yes | Create new pet |
| PUT | `/api/pets/{id}` | Yes | Update pet |
| DELETE | `/api/pets/{id}` | Yes | Delete pet |

**Create/Update Pet Request:**
```json
{
  "name": "Buddy",
  "breed": "Golden Retriever",
  "age": 3,
  "shelterId": 1
}
```

### Shelter Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| GET | `/api/shelters` | Yes | Get all shelters |
| GET | `/api/shelters/{id}` | Yes | Get shelter details |
| GET | `/api/shelters/{id}/pets` | Yes | Get pets at shelter |
| POST | `/api/shelters` | Yes | Create shelter |
| PUT | `/api/shelters/{id}` | Yes | Update shelter |
| DELETE | `/api/shelters/{id}` | Yes | Delete shelter |

**Create/Update Shelter Request:**
```json
{
  "name": "Happy Paws Shelter",
  "address": "123 Main St, Springfield"
}
```

### Adoption Endpoints

| Method | Path | Auth Required | Description |
|--------|------|---------------|-------------|
| POST | `/api/adoptions/apply` | Yes | Apply for pet adoption |
| GET | `/api/adoptions/pet/{petId}` | Yes | Get applications for pet |
| GET | `/api/adoptions/user/{userId}` | Yes | Get user's applications |
| PUT | `/api/adoptions/status` | Yes | Update application status |
| DELETE | `/api/adoptions/{petId}/{userId}` | Yes | Delete application |

**Apply for Adoption Request:**
```json
{
  "petId": 1,
  "adopterId": "user-id",
  "applicationDate": "2024-03-21"
}
```

**Update Status Request:**
```json
{
  "petId": 1,
  "userId": "user-id",
  "status": "Approved"
}
```

## Application Routes

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | Home | No | Landing page |
| `/login` | Login | No | User login page |
| `/register` | Register | No | User registration page |
| `/pets` | PetsList | Yes | Browse all pets |
| `/pets/new` | PetForm | Yes | Create new pet |
| `/pets/:id` | PetDetails | Yes | View pet details |
| `/pets/:id/edit` | PetForm | Yes | Edit pet |
| `/shelters` | SheltersList | Yes | Browse shelters |
| `/shelters/:id` | ShelterDetails | Yes | View shelter details |
| `/adoptions` | AdoptionsList | Yes | View user's applications |
| `/*` | NotFound | - | 404 page |

## Key Features Explained

### Authentication Flow

1. User registers with email, password, and personal information
2. Backend validates and creates user account with "User" role
3. JWT token generated and stored in HTTP-only cookie
4. On page reload, frontend calls `/auth/me` to restore session
5. If token is valid, user stays logged in; otherwise redirected to login

### Protected Routes

The `<ProtectedRoute>` component wraps authenticated pages:
- Checks if user is authenticated
- Shows loading spinner while verifying session
- Redirects unauthenticated users to `/login`

### State Management

- **Auth Context**: Manages user state and authentication
- **Component State**: Each page uses `useState` for forms, data, and error handling
- **Local Storage**: User info backed up in localStorage (for fallback)
- **Session Persistence**: HTTP-only cookies handle actual token storage

### API Service Layer

The `api.js` axios instance provides:
- Automatic credential inclusion (`withCredentials: true`)
- Base URL from environment variable
- JSON content-type headers
- All requests automatically include the JWT token from cookies

## Common Issues & Solutions

### "CORS error" when making requests
- Ensure backend is running on the correct port
- Verify `VITE_API_BASE_URL` in `.env` matches backend URL
- Check that backend allows `http://localhost:5173` origin

### "Cannot GET /auth/me" 
- Backend may be missing the new endpoint
- Ensure backend is rebuilt after adding endpoints
- Check that you're using the latest backend code

### User logged out after page refresh
- The backend `/auth/me` endpoint may be failing
- Check browser's Network tab in DevTools
- Verify JWT cookie is being sent with requests

### "Cannot find module" errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Debugging

### Enable API Logging

To see all API requests/responses, add to `src/services/api.js`:

```javascript
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
```

### Check Session State

Open browser DevTools Console and run:
```javascript
// Check if token cookie exists
document.cookie

// Check localStorage backup
localStorage.getItem('pet-shelter-auth-user')
```

## Deployment

### Building for Production

```bash
npm run build
```

### Deployment Options

1. **Static Hosting** (Netlify, Vercel, GitHub Pages)
   - Upload contents of `dist/` folder
   - Configure API base URL for production backend

2. **Docker**
   ```dockerfile
   FROM node:18 AS build
   WORKDIR /app
   COPY . .
   RUN npm install && npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Server with Node.js**
   - Deploy `dist/` with express or other server
   - Configure API proxy to backend

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Technologies Used

- **React 18.2.0** - UI library
- **Vite 5.0.0** - Build tool and dev server
- **React Router 6.20.0** - Client-side routing
- **Axios 1.6.0** - HTTP client
- **Bootstrap 5** - CSS framework
- **js-cookie** - Cookie management utilities

## Support

For issues or questions:
1. Check the [Debugging](#debugging) section
2. Review the [Common Issues](#common-issues--solutions) section
3. Check browser Console and Network tabs in DevTools
4. Verify backend is running and accessible

---

**Last Updated**: March 2024  
**Frontend Version**: 1.0.0
