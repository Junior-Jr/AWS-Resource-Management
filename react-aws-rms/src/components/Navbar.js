import { useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar, Button, Divider, Dropdown, Menu } from 'antd';
import { CreditCardOutlined, DownOutlined, LogoutOutlined, ProjectOutlined, TeamOutlined } from '@ant-design/icons';

function Navbar() {

  const [current, setCurrent] = useState('class');

  const handleClick = (event) => {
    setCurrent(event.key);
  }

  const handleMenuClick = (event) => {

  }

  const dropdownUser = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item icon={<LogoutOutlined />}>
        Log out
      </Menu.Item>
    </Menu>
  );

  return (

    <Menu className='Navbar' onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Divider type="vertical" />
      <Menu.Item key="class" icon={<TeamOutlined />}>
        <Link to='/class'>Class Management</Link>
      </Menu.Item>
      <Menu.Item key="project" icon={<ProjectOutlined />}>
        <Link to='/project'>Project Management</Link>
      </Menu.Item>
      <Menu.Item key="cost" icon={<CreditCardOutlined />}>
        <Link to='/cost-control'>Cost Control</Link>
      </Menu.Item>
      <Divider type="vertical" />
      <Avatar
        size={{ xs: 24, sm: 32, md: 40, lg: 40, xl: 40, xxl: 40 }}
      >
        PC
      </Avatar>
      <Dropdown overlay={dropdownUser} trigger={['click']}>
        <Button>
          Possathon <DownOutlined />
        </Button>
      </Dropdown>
    </Menu >

  )
}

export default Navbar;