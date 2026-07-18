import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import '../pages/Home/Home.css';

const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <Layout>
      <Header className="navbar">
        <img
          src={`${process.env.PUBLIC_URL}/web_logo.png`}
          alt="VicYan Studio"
          className="site-logo"
        />
        <Menu mode="horizontal" theme="dark" className="menu" disabledOverflow>
          <Menu.Item key="site-name" className="nav-left">
            <Link to="/">VicYan Studio</Link>
          </Menu.Item>

          <Menu.Item key="spacer" disabled style={{ flex: 1, pointerEvents: 'none' }} />

          <Menu.Item key="about" className="nav-right">
            <Link to="/about">ABOUT</Link>
          </Menu.Item>

          <Menu.Item key="experience" className="nav-right">
            <Link to="/experience">EXPERIENCE</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
