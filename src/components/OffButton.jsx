export default function OffButton({ socket }) {
  const sendOff = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "CMD",
          value: "OFF",
        }),
      );
    }
  };

  return (
    <button className="btn-off" onClick={sendOff}>
      OFF
    </button>
  );
}
