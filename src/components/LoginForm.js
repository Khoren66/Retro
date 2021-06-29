import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Api from "../Api";
const { Title } = Typography;

let empty = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [form, setForm] = useState(empty);
  const [warn, setWarning] = useState(false);
  let history = useHistory();

  const handleInputChange = ({ target: { name, value } }) => {
    setWarning(false);
    setForm({
      ...form,
      [name]: value,
    });
    console.log(form);
  };

  const handleOnSignIn = async (e) => {
    e.preventDefault();
    if (form.email && form.password) {
      await Api.login
        .post(form)
        .then(res => {
          if (res.status === 200) {
           localStorage.setItem('retro',JSON.stringify({"token":res.data.auth_token,"user_id":1}))
            setForm(empty);
           history.push("/admin");
          } else {
            setForm(empty); 
            setWarning(true);
          }
        })
        .catch((reqErr) => {
          console.error(reqErr)
          console.log(reqErr.res.status)
        });
    } else {
      setWarning(true);
    }
  };

  return (
    <div className="admin-login-wrapper ">
      <Form className="login-form">
        <Form.Item>
          <Title level={3}>Welcome</Title>
        </Form.Item>
        <Form.Item>
          <Input
            onChange={(e) => handleInputChange(e)}
            value={form.email}
            placeholder={!warn ? "Email" : "Email required"}
            name="email"
            prefix={<UserOutlined />}
          />
        </Form.Item>
        <Form.Item>
          <Input
            onChange={(e) => handleInputChange(e)}
            value={form.password}
            type="password"
            name="password"
            placeholder={!warn ? "Password" : "Password required"}
            prefix={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={(e) => handleOnSignIn(e)}
            type="primary"
            className="login-form-button"
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
