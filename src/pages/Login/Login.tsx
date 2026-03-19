import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Layout, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getAuthToken, fetchWithAuth } from '../../utils/api'; // Import utility functions
import './Login.css';

const { Content } = Layout;

interface LoginProps {
  setUsername: (username: string) => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

interface AuthResponse {
  token?: string;
  username?: string;
  message?: string;
}

const Login: React.FC<LoginProps> = ({ setUsername }) => {
  const [loading, setLoading] = useState<boolean>(false);   // useStatge is built-in hook, which returns [current_state, function_to_change]
  const navigate = useNavigate();

  // Check for an existing token on component mount
  useEffect(() => {
    const checkToken = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await fetchWithAuth('/auth/verify');   //Use await to sync the fetch call within fetchWithAuth
          if (response && response.username) {
            setUsername(response.username);
            notification.success({
              message: 'Welcome Back!',
              description: 'You are already logged in.',
            });
            navigate('/');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('authToken');
          notification.error({
            message: 'Session Expired',
            description: 'Please log in again.',
          });
        }
      }
    };
    checkToken();
  }, [setUsername, navigate]);
  

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data: AuthResponse = await response.json();

        // Check if a token is returned
        if (data.token) {
          // Save token to localStorage
          localStorage.setItem('authToken', data.token);

          // Set username and navigate to home
          setUsername(values.username);
          notification.success({
            message: 'Login Successful',
            description: 'You have successfully logged in.',
          });
          navigate('/');
        } else {
          // Handle unexpected response
          notification.error({
            message: 'Login Failed',
            description: data.message || 'Invalid credentials.',
          });
        }
      } else {
        // Handle HTTP errors
        const errorData: AuthResponse = await response.json();
        notification.error({
          message: 'Login Failed',
          description: errorData.message || 'An error occurred during login.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'An error occurred while logging in. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="login-layout">
      <Content className="login-content">
        <div className="login-box">
          <h2>Login</h2>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default Login; 