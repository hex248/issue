import { invoke } from "@tauri-apps/api/core";
import { useState } from "react";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <h1>Issue Project Manager</h1>

      <div>
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit" onClick={greet}>
          Greet
        </button>
      </div>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;
