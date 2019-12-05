import React from 'react'
import DevTools from 'mobx-react-devtools'
import { Layout } from 'antd'
import { Header, Footer } from './layout'
import { Home, Trade, SearchResult, Notice, MyAccount } from './service'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.scss'

const { Content } = Layout

const App = () => {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Header />
          <Content className="content-root">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/trade/search" component={SearchResult} />
              <Route path="/trade/:tab?/:id?" component={Trade} />
              <Route path="/notice" component={Notice} />
              <Route path="/myaccount" component={MyAccount} />
            </Switch>
          </Content>
          <Footer />
        </Layout>
        {/* <DevTools /> */}
      </div>
    </Router>
  )
}

export default App
