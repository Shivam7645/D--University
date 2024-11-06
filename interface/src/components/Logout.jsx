// src/components/Logout.js
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import styled from "styled-components";
import axios from "axios";

const LogoutButton = styled.button`
  margin-left: 1.5rem;
  color: ${(props) => props.theme.colors.dark};
  text-decoration: none;
  font-weight: 500;
  background-color: transparent;
  border: none;
  &:hover {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

const Logout = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      //console.log("handle logout");
      // Call your backend to invalidate the token
      await axios.post("https://d-university-7ieo.vercel.app/user/logout");

      // Perform client-side logout
      logout();

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <LogoutButton onClick={handleLogout}>Logout</LogoutButton>;
};

export default Logout;
