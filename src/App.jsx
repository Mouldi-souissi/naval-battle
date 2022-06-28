import { useState } from "react";
import "./App.css";
import GameGrid from "./components/GameGrid";

function App() {
  return (
    <div className="App">
      <h1 className="text-center mt-5 mb-3">Naval battle</h1>
      <GameGrid />
    </div>
  );
}

export default App;
