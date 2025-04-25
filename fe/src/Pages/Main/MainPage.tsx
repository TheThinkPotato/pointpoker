import { useState } from "react";
import PpButton from "../../Components/Ppbutton/PpButton";
import { establishConnection, webSocketConnection } from "../../API/connection";
import VotePage from "../Vote/VotePage";

const connection = webSocketConnection;

const MainPage = () => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);

  const validName =
    /^[a-zA-Z0-9]+$/.test(name.trim()) &&
    name.trim().length > 0 &&
    name.trim().length < 20;

  const join = async () => {
    if (!validName) {
      alert(
        "Please enter a valid name (1-20 characters only using letters and numbers)."
      );
      return;
    }

    const connected = await establishConnection(connection);

    if (!connected) {
      alert("Unable to connect to the server. Please try again later.");
      return;
    }
    try {
      await connection.invoke("JoinRoom", roomId, name);
      setJoined(true);
    } catch (error) {
      console.error("Failed to join room:", error);
      alert("Failed to join the room. Please try again.");
    }
  };

  return (
    <article className="p-4 bg-blue-950 h-screen text-white">
      {!joined ? (
        <section>
          Name:
          <input
            className="bg-gray-900 text-white p-2 rounded ml-2 mr-12"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          Room Id:
          <input
            className="bg-gray-900 text-white p-2 rounded ml-2 mr-12"
            placeholder="Room Name"
            value={roomId ?? "Room 1"}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <PpButton
            onClick={join}
            className="bg-blue-600 py-2 px-4 rounded-xl hover:bg-blue-400 cursor-pointer"
            label="Join Room"
          />
        </section>
      ) : (
        <VotePage roomId={roomId} name={name} connection={connection} />
      )}
    </article>
  );
};

export default MainPage;
