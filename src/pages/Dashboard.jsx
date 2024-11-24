import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Users from '../components/Users';
import Permissions from '../components/Permission';
import Routers from '../Routers';
import { TbLockAccess } from "react-icons/tb";


const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Sider className='h-screen' trigger={null} collapsible collapsed={collapsed}>
          <h4 className='text-[#fff] text-center mt-3 mb-3'>RABC</h4>
          <div className="demo-logo-vertical" />
          <Menu 
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
              {
                key: '1',
                icon: <UserOutlined />,
                label: <Link className='no-underline' to="/">Users</Link>,
              },
              {
                key: '2',
                icon: <TbLockAccess className='text-xl' />,
                label: <Link className='no-underline' to="/permissions">Permissions</Link>,
              },
            ]}
          />
        </Sider>
        <Layout className='h-screen'>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            className='h-screen'
            style={{
              margin: '24px 16px',
              overflow:'auto',
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {/* <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/permissions" element={<Permissions />} />
            </Routes> */}
            <Routers/>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default Dashboard;
