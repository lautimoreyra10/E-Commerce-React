import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';
/* import Login from './pages/Login';
 */
import ProfilePage from './pages/Profile';
import Cart from './pages/Cart';
import AuthLogin from './components/AuthLogin';
import AddStore from './pages/AddStore';
/* import AuthProfile from './components/AuthProfile'; */


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AuthLogin />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path= "/add-product" element={<AddProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/AddStore" element={<AddStore />} />
      </Routes>
    </Router>
  );
};

export default App;
