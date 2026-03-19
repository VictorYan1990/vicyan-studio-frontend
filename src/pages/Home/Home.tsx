import React from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import './Home.css';

const { Header } = Layout;

const Home: React.FC = () => {
  return (
    <Layout>
      <Header className="navbar">
        <Menu mode="horizontal" theme="dark" className="menu">
          {/* Left-aligned item */}
          <Menu.Item key="logo" className="nav-left">
            <Link to="/">VicYan Studio</Link>
          </Menu.Item>

          {/* Spacer (empty space between items) */}
          <Menu.Item key="spacer" disabled style={{ flex: 1, pointerEvents: 'none' }}>
            {/* Spacer is not clickable */}
          </Menu.Item>
        </Menu>
      </Header>
    </Layout>
  );
};

export default Home; 