import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import { Divider, Menu, Typography } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import Class from './Class';

const { SubMenu } = Menu;
const { Text } = Typography;

class App extends React.Component {
  state = {
    current: 'class',
  };

  handleClick = e => {
    console.log('click ', e);
    this.setState({ current: e.key });
  };

  render() {
    const { current } = this.state;
    return (
      <Router>
        <Menu className='Navbar' onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
          <Text>AWS Resource Management System</Text>
          <Divider type="vertical" />
          <Menu.Item key="class" icon={<MailOutlined />}>
            <Link to='/class'>
            Class Management
            </Link>
        </Menu.Item>
          <Menu.Item key="exam" icon={<AppstoreOutlined />}>
            Exam Management
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
          <Route path="/class">
            <Class />
          </Route>
        </Switch>
      </Router>
    );
  }
}


export default App;
