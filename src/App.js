import React, { Component } from "react";
import "./App.css";
import FireBaseControlPanel from "./FireBaseControlPanel";

class App extends Component {
  render() {
    return (
      <div className="app">
        <FireBaseControlPanel />
      </div>
    );
  }
}
export default App;
