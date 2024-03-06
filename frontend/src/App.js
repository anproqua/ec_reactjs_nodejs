import logo from './logo.svg';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/layout/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProductDetails from './components/product/ProductDetails.js';
import Login from './components/auth/login.js';
import Register from './components/auth/register.js';
import Profile from './components/user/Profile.js';
import UpdateProfile from './components/user/UpdateProfile.js';
import ProtectedRoute from './components/auth/ProtectedRoute.js';
import UploadAvatar from './components/user/UploadAvatar.jsx';
import UpdatePassword from './components/user/UpdatePassword.jsx';
function App() {
  return (
    // <div className="App">
    //     <Header/>
    //     <Home/>
    //     <Footer/>
    // </div>
    <Router>
      <div className="App">
        <Toaster position='top-center' />
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/me/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
           <Route path='/me/update_password' element={<UpdatePassword />} />
           <Route path='/me/upload_avatar' element={<UploadAvatar />} />
          <Route path='/me/update_profile' element={<UpdateProfile />} />
          
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
