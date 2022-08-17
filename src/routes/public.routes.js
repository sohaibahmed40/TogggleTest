import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom'
import { getToken } from "../services/auth.service";

const PublicRoute = ({ token, children }) => {
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;