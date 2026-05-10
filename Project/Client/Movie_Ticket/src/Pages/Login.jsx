import React from 'react'
import { Button, Form, Input, message, Card, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom"
import { login } from '../calls/authCalls.js';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';
import { VideoCameraOutlined } from '@ant-design/icons';
import './Auth.css';

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (values) => {
    try {
      const userData = await login(values)
      if (userData && userData.success) {
        message.success(userData.message)
        dispatch(setUserData(userData.user))
        // Navigate based on role
        if (userData.user.role === 'admin') {
          navigate('/admin')
        } else if (userData.user.role === 'partner') {
          navigate('/partner')
        } else {
          navigate('/home')
        }
      } else {
        console.log(userData)
        message.error(userData?.message || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      message.error(error?.message || "Login failed")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-brand">
            <VideoCameraOutlined className="brand-icon" />
            <Title level={1} className="brand-title">MovieHub</Title>
            <Text className="brand-subtitle">Your Gateway to Cinematic Excellence</Text>
          </div>
        </div>

        <div className="auth-right">
          <Card className="auth-card">
            <Title level={2} className="auth-title">Welcome Back</Title>
            <Text className="auth-subtitle">Sign in to continue your movie journey</Text>

            <Form layout="vertical" onFinish={onSubmit} className="auth-form">
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: 'email', message: "Please enter a valid email" }
                ]}
              >
                <Input
                  size="large"
                  placeholder="Enter your email"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  className="auth-input"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  size="large"
                  className="auth-button"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div className="auth-footer">
              <Text>Don't have an account? <Link to="/register" className="auth-link">Sign up now</Link></Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login