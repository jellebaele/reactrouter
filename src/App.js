import { useState } from 'react';
import {
   Link,
   Routes,
   Route,
   BrowserRouter,
   Navigate,
   Outlet,
} from 'react-router-dom';

// https://www.robinwieruch.de/react-router-private-routes/

function App() {
   const [user, setUser] = useState(null);

   const handleLogin = () =>
      setUser({
         id: '1',
         name: 'Jean',
         permissions: ['analyze'],
         roles: ['admin1'],
      });
   const handleLogout = () => setUser(null);

   return (
      <div className="App">
         <h1>React Router</h1>

         <BrowserRouter>
            <Navigation />

            {user ? (
               <button onClick={handleLogout}>Sign out</button>
            ) : (
               <button onClick={handleLogin}>Sign in</button>
            )}

            <Routes>
               <Route index element={<Landing />} />
               <Route path="landing" element={<Landing />} />
               {/* Define routes specifically allowed for this condition in the 'elements' prop */}
               {/* <Route
                  path="home"
                  element={
                     <LoggedInRoute user={user}>
                        <Home />
                     </LoggedInRoute>
                  }
               ></Route> */}

               {/* Another approach is defining  routes specifically allowed for this condition as children of the Route component.
                    These children are returned by the 'Outlet' component. */}
               <Route element={<LoggedInRoute user={user} />}>
                  <Route path="home" element={<Home />} />
                  <Route path="dashboard" element={<Dashboard />} />
               </Route>
               <Route
                  element={
                     <PermissionsRoute
                        user={user}
                        requiredPermission={'analyze'}
                     />
                  }
               >
                  <Route path="analytics" element={<Analytics />} />
               </Route>

               <Route
                  element={
                     <AdminRoute user={user} redirectPath="/access-denied" />
                  }
               >
                  <Route path="admin" element={<Admin />} />
               </Route>
               <Route path="access-denied" element={<AccessDenied />} />
               <Route path="*" element={<p>There's nothing here: 404!</p>} />
            </Routes>
         </BrowserRouter>
      </div>
   );
}

const Navigation = () => (
   <nav
      style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}
   >
      <Link to="/landing">Landing</Link>
      <Link to="/home">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/admin">Admin</Link>
   </nav>
);

const Landing = () => {
   return <h2>Landing (Public: anyone can access this page)</h2>;
};

const Home = () => {
   return (
      <h2>Home, you have access(Protected: authenticated user required)</h2>
   );
};

const Dashboard = () => {
   return (
      <h2>
         Dashboard, you have access(Protected: authenticated user required)
      </h2>
   );
};

const Analytics = () => {
   return (
      <h2>
         Analytics, you have access(Protected: authenticated user with
         permission 'analyze' required)
      </h2>
   );
};

const Admin = () => {
   return (
      <h2>
         Admin, you have access (Protected: authenticated user with role 'admin'
         required)
      </h2>
   );
};

const AccessDenied = () => {
   return (
      <>
         <h2>Access denied!</h2>
         <Link to="/">Go back to landing page</Link>
      </>
   );
};

const LoggedInRoute = ({ user, redirectPath = '/landing', children }) => {
   const isAllowed = !!user;

   return (
      <ProtectedRoute
         isAllowed={isAllowed}
         redirectPath={redirectPath}
         children={children}
      />
   );
};

const PermissionsRoute = ({
   user,
   requiredPermission,
   redirectPath = '/landing',
   children,
}) => {
   const isAllowed = !!user && user.permissions.includes(requiredPermission);

   return (
      <ProtectedRoute
         isAllowed={isAllowed}
         redirectPath={redirectPath}
         children={children}
      />
   );
};

const AdminRoute = ({ user, redirectPath = '/landing', children }) => {
   const isAllowed = !!user && user.roles.includes('admin');

   return (
      <ProtectedRoute
         isAllowed={isAllowed}
         redirectPath={redirectPath}
         children={children}
      />
   );
};

const ProtectedRoute = ({ isAllowed, redirectPath = '/landing', children }) => {
   if (!isAllowed) {
      return <Navigate to={redirectPath} />;
   }

   // If children are present in the "element" prop of a Route component, render these
   // Otherwise, render children of the route element
   return children ? children : <Outlet />;
};

export default App;
