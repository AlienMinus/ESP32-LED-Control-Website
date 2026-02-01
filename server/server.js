const http = require("http");
const WebSocket = require("ws");

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let espSocket = null;
let espIP = null;

wss.on("connection", (client) => {
  console.log("🌐 Browser connected");

  client.on("message", (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch {
      return;
    }

    // 🔹 CONNECT request
    if (data.type === "CONNECT") {

      // Already connected → do NOT reconnect
      if (espSocket && espSocket.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          status: "ESP_ALREADY_CONNECTED",
          ip: espIP
        }));
        return;
      }

      espIP = data.ip;
      const espUrl = `ws://${espIP}:81`;
      console.log("🔌 Connecting to ESP32:", espUrl);

      espSocket = new WebSocket(espUrl, { handshakeTimeout: 5000 });

      espSocket.on("open", () => {
        console.log("✅ ESP32 connected");
        client.send(JSON.stringify({ status: "ESP_CONNECTED" }));
      });

      espSocket.on("message", (msg) => {
        client.send(JSON.stringify({ esp: msg.toString() }));
      });

      espSocket.on("close", () => {
        console.log("❌ ESP32 disconnected");
        espSocket = null;
        espIP = null;
        client.send(JSON.stringify({ status: "ESP_DISCONNECTED" }));
      });

      espSocket.on("error", (err) => {
        console.error("🚫 ESP socket error:", err.message);
        espSocket = null;
        espIP = null;
        client.send(JSON.stringify({
          status: "ESP_UNREACHABLE",
          error: err.message
        }));
      });
    }

    // 🔹 COMMAND forwarding
    if (
      data.type === "CMD" &&
      espSocket &&
      espSocket.readyState === WebSocket.OPEN
    ) {
      espSocket.send(data.value);
    }
  });

  client.on("close", () => {
    console.log("🔌 Browser disconnected");
  });
});

server.listen(3001, () => {
  console.log("✅ Proxy running on http://localhost:3001");
});
