import { useState } from "react";
import IPInput from "./components/IPInput";
import OnButton from "./components/OnButton";
import OffButton from "./components/OffButton";
import "./App.css";

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("Not Connected");

  const connectToESP = (ip) => {
    const ws = new WebSocket(`ws://${ip}:81`);

    ws.onopen = () => {
      setSocket(ws);
      setConnected(true);
      setStatus("Connected");
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      setConnected(false);
      setSocket(null);
      setStatus("Disconnected");
      console.log("WebSocket closed");
    };

    ws.onerror = (err) => {
      setStatus("Connection Error");
      console.error("WebSocket error:", err);
    };
  };

  return (
    <div className="app">
      <div className="card">
        <h2>ESP32 LED Controller</h2>

        <IPInput onConnect={connectToESP} />

        {connected && (
          <div className="controls">
            <OnButton socket={socket} />
            <OffButton socket={socket} />
          </div>
        )}

        <p className="status">Status: {status}</p>
      </div>
    </div>
  );
}

export default App;
