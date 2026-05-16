import UserManagement from './pages/admin/UserManagement';
import RoleRequests from './pages/admin/RoleRequests';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Account from './pages/account/Account';
import ChangePassword from './pages/account/ChangePassword';
import PetsList from './pages/pets/PetsList';
import PetForm from './pages/pets/PetForm';
import PetDetails from './pages/pets/PetDetails';
import SheltersList from './pages/shelters/SheltersList';
import ShelterForm from './pages/shelters/ShelterForm';
import ShelterDetails from './pages/shelters/ShelterDetails';
import AdoptionsList from './pages/adoptions/AdoptionsList';
import AdoptionForm from './pages/adoptions/AdoptionForm';
import AdoptionDetails from './pages/adoptions/AdoptionDetails';

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Admin-only user management */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]} fallbackTo="/">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* Admin-only role requests */}
          <Route
            path="/admin/role-requests"
            element={
              <ProtectedRoute allowedRoles={["Admin"]} fallbackTo="/">
                <RoleRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <PetsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/new"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Employee"]} fallbackTo="/pets">
                <PetForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/:id"
            element={
              <ProtectedRoute>
                <PetDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pets/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Employee"]} fallbackTo="/pets">
                <PetForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shelters"
            element={
              <ProtectedRoute>
                <SheltersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelters/new"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Employee"]} fallbackTo="/shelters">
                <ShelterForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelters/:id"
            element={
              <ProtectedRoute>
                <ShelterDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shelters/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Employee"]} fallbackTo="/shelters">
                <ShelterForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/adoptions"
            element={
              <ProtectedRoute>
                <AdoptionsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adoptions/new"
            element={
              <ProtectedRoute>
                <AdoptionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adoptions/status"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Employee"]} fallbackTo="/adoptions/new">
                <AdoptionDetails />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}