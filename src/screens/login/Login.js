import React from "react";
import './login.css'
import 'antd/dist/antd.css';
import Header from "../../components/Header";
import LoginForm from "../../components/LoginForm";
import "./login.css"
const Login = () => {
    

  return (
    <div>
      <Header />
      <LoginForm classname="admin-login-wrapper"/>
    </div>
  );
};

export default Login;
