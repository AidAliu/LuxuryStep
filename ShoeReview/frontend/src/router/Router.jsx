import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../views/Homepage/Homepage";
import Login from "../views/Homepage/Login";
import Register from "../views/Homepage/Register";
import ControlPanel from "../views/controlpanel/ControlPanel";
import PaymentsPage from "../views/controlpanel/Payments/PaymentsPage"; 
import PaymentsForm from "../views/controlpanel/Payments/PaymentsForm";
import UsersForm from "../views/controlpanel/Users/UsersForm";
import UsersPage from "../views/controlpanel/Users/UsersPage";
import ShoesPage from "../views/controlpanel/Shoes/ShoesPage";
import ShoesForm from "../views/controlpanel/Shoes/ShoesForm";
import BrandsPage from "../views/controlpanel/Brands/BrandsPage";
import BrandsForm from "../views/controlpanel/Brands/BrandsForm";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Home, Login, Register */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        

        {/* Control Panel */}
        <Route path="/controlpanel" element={<ControlPanel />} />
        {/* Payments */}        
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/payments/new" element={<PaymentsForm />} />
        <Route path="/payments/edit/:PaymentID" element={<PaymentsForm />} />

         {/* Users */}
         <Route path="/users" element={<UsersPage />} />
        <Route path="/users/new" element={<UsersForm />} />
        <Route path="/users/edit/:userId" element={<UsersForm />} />

        {/* Shoes */}
        <Route path="/shoes" element={<ShoesPage />} />
        <Route path="/shoes/new" element={<ShoesForm />} />
        <Route path="/shoes/edit/:ShoeID" element={<ShoesForm />} />

        {/* Brand */}
        <Route path='/brands' element={<BrandsPage/>} />
        <Route path='/brands/new' element={<BrandsForm/>} />
        <Route path='/brands/edit/:BrandID' element={<BrandsForm/>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
