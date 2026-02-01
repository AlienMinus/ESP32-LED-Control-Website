import { useState } from "react";

export default function IPInput({ onConnect }) {
  const [ip, setIp] = useState("");

  const handleConnect = () => {
    if (!ip.trim()) {
      alert("Please enter ESP32 IP address");
      return;
    }
    onConnect(ip);
  };

  return (
    <div className="ip-input">
      <input
        type="text"
        placeholder="ESP32 IP (e.g. 192.168.1.10)"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
}
