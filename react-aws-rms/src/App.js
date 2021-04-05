import React from 'react';
import { Layout } from 'antd'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import logo from './nav-thai.svg'
import './App.css';
import Class from './components/Class';
import ClassDetail from './views/ClassDetail';
import Exam from './components/Exam';
import Navbar from './components/Navbar';
import Error500 from './components/Error500';

const { Header, Content, Footer } = Layout;

function App() {

  return (
    <Router>
      <Layout>
        <Header>
          <img className='App-logo' src={logo} alt='it-kmitl-logo' />
          <Navbar />
        </Header>
        <Content>
          <Switch>
            <Route exact path="/class">
              <Class />
            </Route>
            <Route path="/class/:subject_id/:aws_tag_value">
              <ClassDetail />
            </Route>
            <Route path="/exam">
              <Exam />
            </Route>
            <Route path="*">
              <Error500 />
            </Route>
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          ©2021 Faculty of Information Technology, KMITL | Developed by Possathon and Apinant
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;