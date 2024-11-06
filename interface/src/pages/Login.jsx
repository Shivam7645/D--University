// frontend/src/components/Login.js

import React, { useContext, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { UserContext } from "../contexts/UserContext";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  align-items: center;
  padding: 2rem;
  background-color: ${(props) => props.theme.colors.light};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: ${(props) => props.theme.colors.dark};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

const ForgetPassword = styled.a`
  margin-top: 1rem;
  color: ${(props) => props.theme.colors.secondary};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const { login } = useContext(UserContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when user modifies input
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    const { email, password } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email Address is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post(
          "https://d-university-7ieo.vercel.app/user/login", // Adjust the URL as necessary
          formData
        );
        // setSuccessMessage(response.data.message);

        login(response.data.token, response.data.user); // Store user info in context
        navigate("/user/dashboard");
        // Redirect user or perform other actions upon successful login
      } catch (error) {
        if (error.response) {
          setErrors({ submit: error.response.data.message });
        } else {
          setErrors({
            submit: "An unexpected error occurred. Please try again.",
          });
        }
      }
    }
  };

  return (
    <LoginContainer>
      <Title>Login</Title>
      {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
      {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

        <Button type="submit">Login</Button>
      </Form>
      <ForgetPassword href="/forgot-password">Forget Password?</ForgetPassword>
    </LoginContainer>
  );
};

export default Login;
