import React, { useEffect } from "react";
// import { toast } from "react-toastify";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../../redux/auth.slice";
const ProtectedRoute = ({ allowedUserTypes }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state.auth);
  // if (!auth) {
  //   dispatch(verifyToken());
  // }
  // if (!auth) {
  //   navigate("/");
  // } else {
  return <Outlet />;
  // }
};

export default ProtectedRoute;
