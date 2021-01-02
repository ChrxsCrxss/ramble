import React, { Component } from "react";
import DraftDeck from "./containers/DraftDeck/DraftDeck";
import Introduction from './components/Introduction/Introduction';
import Layout from './components/Layout/Layout';

export default class App extends Component {



  render() {
    return (
      <Layout>
        <Introduction />
        <DraftDeck />
      </Layout>
    )
  }

}
