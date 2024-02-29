import logo from './logo.svg';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/layout/Home';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import ProductDetails from './components/product/ProductDetails.js';
function App() {
  return (
    // <div className="App">
    //     <Header/>
    //     <Home/>
    //     <Footer/>
    // </div>
    <Router>
      <div className="App">
        <Toaster position='top-center'/>
        <Header/>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/product/:id' element={<ProductDetails/>} />
        </Routes>
        <Footer/>
    </div>
    </Router>
  );
}
export default App;
