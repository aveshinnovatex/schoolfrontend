import React, { useEffect } from "react";
// import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedUserTypes }) => {
  return <Outlet />;
};

export default ProtectedRoute;
