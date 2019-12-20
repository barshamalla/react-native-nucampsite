import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import { About } from './About';
import { Services } from './Services';
import { Galleries } from './Galleries';
import { Contact } from './Contact';
import { NoMatch } from './NoMatch';
import { Layout } from './components/Layout';
import { NavigationBar } from './components/NavigationBar'

function App() {
  return (
    <React.Fragment>
      
      <Layout>
        <Router>
        <NavigationBar />
          <Switch>
            <Route exact path="/" component = {Home} />
            <Route exact path="/about" component = {About} />
            <Route exact path="/services" component = {Services} />
            <Route exact path="/galleries" component = {Galleries} />
            <Route exact path="/contact" component = {Contact} />
            <Route component = {NoMatch} />

          </Switch>
        </Router>
      </Layout>
    </React.Fragment>
  );
}

export default App;
