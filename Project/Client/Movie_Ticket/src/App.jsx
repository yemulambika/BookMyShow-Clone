import './App.css'
import Landing from './Pages/Landing'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import {BrowserRouter , Routes , Route} from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import RoleBasedRoute from './components/RoleBasedRoute'
import Admin from './Pages/Admin'
import Partner from './Pages/Partner'
import SingleMovie from './Pages/SingleMovie'
import BookShow from './Pages/BookShow'
import PaymentSuccess from './Pages/PaymentSuccess'
import MyBookings from './Pages/User/MyBookings'

function App() {
 

  return (
    <>
    <BrowserRouter>
       <Routes>
         {/* Landing Page */}
         <Route path='/' element={<Landing/>}/>
         
         {/* Public Routes */}
         <Route path='/login' element={<PublicRoute><Login/></PublicRoute>}/>
         <Route path='/register' element={<PublicRoute><Register/></PublicRoute>}/>
         
         {/* Protected Routes - User Only */}
         <Route path='/home' element={<ProtectedRoute><RoleBasedRoute allowedRoles={['user']}><Home/></RoleBasedRoute></ProtectedRoute>}/>
         <Route path='/singleMovie/:id/' element={<ProtectedRoute><RoleBasedRoute allowedRoles={['user']}><SingleMovie/></RoleBasedRoute></ProtectedRoute>}/>
         <Route path='/bookshow/:id' element={<ProtectedRoute><RoleBasedRoute allowedRoles={['user']}><BookShow/></RoleBasedRoute></ProtectedRoute>}/>
         <Route path='/payment-success' element={<ProtectedRoute><RoleBasedRoute allowedRoles={['user']}><PaymentSuccess/></RoleBasedRoute></ProtectedRoute>}/>
         <Route path='/my-bookings' element={<ProtectedRoute><RoleBasedRoute allowedRoles={['user']}><MyBookings/></RoleBasedRoute></ProtectedRoute>}/>
         
         {/* Protected Routes - Admin Only */}
         <Route path='/admin' element={<ProtectedRoute><RoleBasedRoute allowedRoles={['admin']}><Admin/></RoleBasedRoute></ProtectedRoute>}/>
         
         {/* Protected Routes - Partner Only */}
         <Route path='/partner' element={<ProtectedRoute><RoleBasedRoute allowedRoles={['partner']}><Partner/></RoleBasedRoute></ProtectedRoute>}/>
       </Routes>
    </BrowserRouter>
     


  
    
    </>
  )
}

export default App