import { Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import Signup from './Components/Login/Signup';
import Signin from './Components/Login/SignIn';
import Navbar from './Components/Navbar/Navbar';
import NavbarBanner from './Components/NavbarBanner/NavbarBanner';
import SigninPassword from './Components/Login/SigninPassword';
import Products from './Components/Products/Products';
import Footer from './Components/Footer/Footer';
import Cart from './Components/Cart/Cart';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import Orders from './Components/Orders/Orders';
import Payment from './Components/Payment/Payment';
import NewAddress from './Components/Address/NewAddress';
import AllAddresses from './Components/Address/AllAddresses';





function App() {
  const location = useLocation(); 
  const hideNavbarAndFooter = ["/register", "/login", "/loginPassword"].includes(location.pathname);
  
  

  return (
    <> 
      {!hideNavbarAndFooter && <Navbar />}
      {!hideNavbarAndFooter && <NavbarBanner />}
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path='/loginPassword' element={<SigninPassword />} />
        <Route path='/product_types/:Type' element={<Products />} />
        <Route path="/products/search" element={<Products />} />
        <Route path='/cart' element={<Cart />} />
        <Route path="/productdetail/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders/>}/>
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/newaddress" element={<NewAddress/>}/>
        <Route path="/alladdresses" element={<AllAddresses/>}/>
        
      </Routes>
      {!hideNavbarAndFooter && <Footer/>}
    </>
  );
}

export default App;