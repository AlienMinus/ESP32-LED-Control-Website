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
  const ws = new WebSocket("https://esp32-led-control-website.onrender.com");

  ws.onopen = () => {
    ws.send(JSON.stringify({
      type: "CONNECT",
      ip: ip
    }));
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    console.log("Proxy:", data);
  };

  setSocket(ws);
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
