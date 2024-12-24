import React from "react";
import Header from "./components/Header";
import Form from "./components/Form";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <div className="background-overlay"></div>
      <div className="content-wrapper">
        <Header />
        <Form />
      </div>
    </div>
  );
}

export default App;
