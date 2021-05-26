import React from 'react'
import { Layout } from 'antd'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import logo from './nav-thai.svg'
import './App.css'
import Class from './components/Class'
import ClassDetail from './views/ClassDetail'
import CostDashboard from './views/CostDashboard'
import Navbar from './components/Navbar'
import Error500 from './components/Error500'
import Project from './views/Project'
import CostControl from './views/CostControl'
import ProjectDetail from './views/ProjectDetail'
import VPCDetail from './views/VPCDetail'

const { Header, Content, Footer } = Layout;

function App() {

  return (
    <Router>
      <Layout>
        <Header>
          <img className='App-logo' src={logo} alt='it-kmitl-logo' />
          <Navbar />
        </Header>
        <Content style={{ overflow: 'initial' }}>
          <Switch>
            <Route exact path="/class">
              <Class />
            </Route>
            <Route exact path="/project">
              <Project />
            </Route>
            <Route path="/class/:subject_id/:aws_tag_value">
              <ClassDetail />
            </Route>
            <Route path="/vpc/:vpc_id">
              <VPCDetail />
            </Route>
            <Route path="/project/:subject_id/:aws_tag_value">
              <ProjectDetail />
            </Route>
            <Route exact path="/cost-control">
              <CostControl />
            </Route>
            <Route path="/cost-control/:name">
              <CostDashboard />
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