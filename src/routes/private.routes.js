import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom'
import { getToken } from "../services/auth.service";

const PrivateRoute = ({ token, children }) => {
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;