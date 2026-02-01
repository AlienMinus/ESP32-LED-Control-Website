export default function OnButton({ socket }) {
  const sendOn = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "CMD",
          value: "ON",
        }),
      );
    }
  };

  return (
    <button className="btn-on" onClick={sendOn}>
      ON
    </button>
  );
}
