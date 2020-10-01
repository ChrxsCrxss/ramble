import React, { Component } from "react";

import DraftDeck from "./containers/DraftDeck/DraftDeck";
import Checkboxes from './components/UI/Checkboxes/Checkboxes';
import Introduction from './components/Introduction/Introduction';


export default class App extends Component {

  render() {
    return (
      <div>
        <Introduction />
        <Checkboxes />
        <DraftDeck />
      </div>
    )
  }

}
