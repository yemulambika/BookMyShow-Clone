import React, { useState } from "react";
import { Form, Input, Button, message, Card, Typography, Radio } from 'antd';
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux';
import { register } from "../calls/authCalls.js";
import { setUserData } from '../redux/userSlice.js';
import { VideoCameraOutlined } from '@ant-design/icons';
import './Auth.css';

const { Title, Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values) => {
    setSubmitting(true)
    try {
      const userData = await register(values)
      if (userData && userData.success) {
        message.success(userData.message)
        // Registration auto-logs the user in (cookies set by the server),
        // so store the user and route to their dashboard.
        if (userData.user) {
          dispatch(setUserData(userData.user))
        }
        const role = userData.user?.role || values.role
        if (role === 'partner') {
          navigate('/partner')
        } else {
          navigate('/home')
        }
      } else {
        message.error(userData?.message || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      message.error(error?.message || "Registration failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <VideoCameraOutlined className="brand-icon" />
            <Title level={1} className="brand-title">MovieHub</Title>
            <Text className="brand-subtitle">Join us and start booking your favorite movies</Text>
          </div>
        </div>

        <div className="auth-right">
          <Card className="auth-card">
            <Title level={2} className="auth-title">Create Account</Title>
            <Text className="auth-subtitle">Sign up to get started</Text>

            <Form layout="vertical" onFinish={onSubmit} className="auth-form">
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Name is required!" }]}
              >
                <Input
                  size="large"
                  placeholder="Enter your full name"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required!" },
                  { type: 'email', message: "Please enter a valid email" }
                ]}
              >
                <Input
                  size="large"
                  type="email"
                  placeholder="Enter your email"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Password is required!" },
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Create a password"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                label="Register As"
                name="role"
                initialValue="user"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                <Radio.Group size="large" className="role-selector">
                  <Radio.Button value="user">User</Radio.Button>
                  <Radio.Button value="partner">Partner</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={submitting}
                  className="auth-button"
                >
                  Create Account
                </Button>
              </Form.Item>
            </Form>

            <div className="auth-footer">
              <Text>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Register;