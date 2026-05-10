import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, logout } from '../calls/authCalls';
import { setUserData } from '../redux/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Input, Button, Avatar, Typography, Space } from 'antd';
import { UserOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import './Navbar.css';

const { Header } = Layout;
const { Text } = Typography;

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      dispatch(setUserData(user || null));
    })();
  }, [dispatch]);

  const onSearch = (value) => {
    console.log("Search:", value);
  };

  const onLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      dispatch(setUserData(null));
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      dispatch(setUserData(null));
      navigate('/login');
    }
  };

  const displayName = userData?.name || userData?.username || "User";

  return (
    <Layout>
      <Header className="navbar-header">
        <div className="navbar-content">
          <Link 
            to={userData?.role === 'partner' ? "/partner" : userData?.role === 'admin' ? '/admin' : '/home'} 
            className="navbar-brand"
          >
            <Text strong className="brand-text">MovieHub</Text>
          </Link>

          <div className="navbar-search">
            <Input
              placeholder="Search movies..."
              onPressEnter={(e) => onSearch(e.target.value)}
              className="search-input"
              prefix={<SearchOutlined />}
            />
          </div>

          <div className="navbar-actions">
            {userData?.role === 'user' && (
              <Link to="/my-bookings">
                <Button type="link" className="nav-link">My Bookings</Button>
              </Link>
            )}
            <div className="user-info">
              <Avatar icon={<UserOutlined />} className="user-avatar" />
              <Text className="user-name">{displayName}</Text>
            </div>
            <Button 
              icon={<LogoutOutlined />} 
              onClick={onLogout} 
              className="logout-button"
            >
              Logout
            </Button>
          </div>
        </div>
      </Header>
    </Layout>
  );
}

export default Navbar;