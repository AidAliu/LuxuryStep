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
import ReviewPage from "../views/controlpanel/Reviews/ReviewPage";
import ReviewForm from "../views/controlpanel/Reviews/ReviewForm";
import StyleForm from "../views/controlpanel/Styles/StylesForm";
import StylePage from "../views/controlpanel/Styles/StylesPage";
import OrdersForm from "../views/controlpanel/Orders/OrdersForm";
import OrdersPage from "../views/controlpanel/Orders/OrdersPage";
import OrderItemForm from "../views/controlpanel/OrderItems/OrderItemForm";
import OrderItemPage from "../views/controlpanel/OrderItems/OrderItemPage";

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

        {/* Review */}
        <Route path='/reviews' element={<ReviewPage/>} />
        <Route path='/reviews/new' element={<ReviewForm/>} />
        <Route path='/reviews/edit/:ReviewID' element={<ReviewForm/>} />

        {/* Style */}
        <Route path='/styles' element={<StylePage/>} />
        <Route path='/styles/new' element={<StyleForm/>} />
        <Route path='/styles/edit/:StyleID' element={<StyleForm/>} />

        {/* Orders */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/new" element={<OrdersForm />} />
        <Route path="/orders/edit/:OrderID" element={<OrdersForm />} />

        {/* Order Items */} 
        <Route path="/order-items" element={<OrderItemPage />} />
        <Route path="/order-items/new" element={<OrderItemForm />} />
        <Route path="/order-items/edit/:OrderItemID" element={<OrderItemForm />} />
       
        
      </Routes>
    </Router>
  );
};

export default AppRouter;
