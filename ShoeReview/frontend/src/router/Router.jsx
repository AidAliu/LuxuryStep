import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "../views/Homepage/Homepage";
import Login from "../views/Homepage/Login";
import Register from "../views/Homepage/Register";
import ControlPanel from "../components/controlpanel/ControlPanel";
import { PaymentCreate } from "../components/payments/PaymentCreate";
import { PaymentEdit } from "../components/payments/PaymentEdit";
import { PaymentList } from "../components/payments/PaymentList";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Home, Login, Register */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Payment Routes */}
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/payments/new" element={<PaymentCreate />} />
        <Route path="/payments/edit/:id" element={<PaymentEdit />} />

        {/* Control Panel */}
        <Route path="/controlpanel" element={<ControlPanel />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
