import React from "react";
import { Button } from "@mui/material";
import rsLogo from "./logo-with-name.png";
import "./App.css";

import UserFlow from './components/user-flow';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={rsLogo} className="App-logo" alt="logo" />
      </header>
      <main>
        <UserFlow />
      </main>
    </div>
  );
}

export default App;
