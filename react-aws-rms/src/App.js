import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import { Divider, Menu, Typography } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import Class from './components/Class';
import PolicyEditor from './components/PolicyEditor';

const { SubMenu } = Menu;
const { Text } = Typography;

function App() {

  const [current, setCurrent] = useState('class');

  const handleClick = (event) => {
    console.log('click', event);
    setCurrent(event.key);
  }

  return (
    <Router>
      <Menu className='Navbar' onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        <Text>AWS Resource Management System</Text>
        <Divider type="vertical" />
        <Menu.Item key="class" icon={<MailOutlined />}>
          <Link to='/class'>
            Class Management
            </Link>
        </Menu.Item>
        <Menu.Item key="exam" icon={<AppstoreOutlined />}>
          <Link to='/policy-editor'>
            Exam Management
          </Link>
        </Menu.Item>
        <SubMenu key="SubMenu" icon={<SettingOutlined />} title="Project Management">
          <Menu.ItemGroup title="Item 1">
            <Menu.Item key="setting:1">Option 1</Menu.Item>
            <Menu.Item key="setting:2">Option 2</Menu.Item>
          </Menu.ItemGroup>
          <Menu.ItemGroup title="Item 2">
            <Menu.Item key="setting:3">Option 3</Menu.Item>
            <Menu.Item key="setting:4">Option 4</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        <Menu.Item key="cost" icon={<AppstoreOutlined />}>
          Cost Control
        </Menu.Item>
      </Menu>

      <Switch>
        <Route path="/">
          <Class />
        </Route>
        <Route path="/policy-editor">
          <PolicyEditor />
        </Route>
      </Switch>
    </Router>
  );
}



export default App;
