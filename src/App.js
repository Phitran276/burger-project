import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from './Components/Layout/Layout';
import BurgerBuilder from './Containers/BurgerBuilder/BurgerBuilder';
import Checkout from './Containers/Checkout/Checkout';
import Orders from './Containers/Orders/Orders';

class App extends Component {

  state = {
    show: true
  };

  //Instance of remove interceptor
  // componentDidMount() {
  //   setTimeout(() => {
  //       this.setState({show: false});
  //   }, 5000);
  // }

  render() {
    return (
      <div>
        <Layout>
          <Switch>
            <Route path="/" exact component={BurgerBuilder} />
            <Route path="/orders" component={Orders} />
            <Route path="/checkout" component={Checkout} />
          {/* Remove Exact if have nested Route */}
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
