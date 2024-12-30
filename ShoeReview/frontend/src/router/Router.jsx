import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../views/Homepage/Homepage";
import Login from "../views/Homepage/Login";
import Register from "../views/Homepage/Register";
import ControlPanel from "../views/controlpanel/ControlPanel";
import PaymentsPage from "../views/controlpanel/PaymentsPage"; 
import PaymentsForm from "../views/controlpanel/PaymentsForm";

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

      </Routes>
    </Router>
  );
};

export default AppRouter;
