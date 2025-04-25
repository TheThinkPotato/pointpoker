import { useCallback, useEffect, useRef, useState } from "react";
import PpButton from "../../Components/Ppbutton/PpButton";
import { isWebSocketConnectionStateDisconnected } from "../../API/connection";

interface votePageProps {
  roomId: string;
  name: string;
  connection: signalR.HubConnection;
}

const voteOptions = ["1", "2", "3", "5", "8", "13", "?"];

const VotePage = ({ roomId, name, connection }: votePageProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setVote] = useState("");
  const [votes, setVotes] = useState<Record<string, string>>({});

  const showVotes = useRef(false);

  const submitVote = (v: string) => {
    setVote(v);
    connection.invoke("SubmitVote", roomId, name, v);
  };

  const revealVotes = () => {
    connection.invoke("RevealVotes", roomId);
  };

  const clearVotes = () => {
    connection.invoke("ClearVotes", roomId);
  };

  const startConnection = useCallback(async () => {
    if (connection.state === isWebSocketConnectionStateDisconnected) {
      await connection.start();
      console.log("Connected to SignalR");
    }

    connection.on("UserJoined", (user) => {
      console.log(`${user} joined`);
    });

    connection.on("VoteSubmitted", (user, vote) => {
      setVotes((prev) => ({ ...prev, [user]: vote }));
    });

    connection.on("VotesRevealed", (votes: Record<string, string>) => {
      setVotes(votes);
      showVotes.current = true;
    });

    connection.on("VotesCleared", () => {
      setVotes((prev) => {
        const updatedVotes: Record<string, string> = {};
        for (const user in prev) {
          updatedVotes[user] = "";
        }
        return updatedVotes;
      });
      showVotes.current = false;
    });
  }, [connection]);

  useEffect(() => {
    startConnection();

    return () => {
      connection.off("UserJoined");
      connection.off("VoteSubmitted");
      connection.off("VotesRevealed");
      connection.off("VotesCleared");
    };
  }, [connection, startConnection]);

  return (
    <section>
      <h1>Room: {roomId}</h1>
      {voteOptions.map((v) => (
        <PpButton
          key={v}
          label={v}
          onClick={() => submitVote(v)}
          className="mx-1"
        />
      ))}
      <div className="mt-4">
        <PpButton
          onClick={revealVotes}
          className="bg-blue-600 py-2 px-4 rounded-xl hover:bg-blue-400 cursor-pointer mx-2"
          label="Reveal Votes"
        />
        <PpButton
          onClick={clearVotes}
          className="bg-blue-600 py-2 px-4 rounded-xl hover:bg-blue-400 cursor-pointer mx-2"
          label="Clear"
        />
      </div>
      <div className="mt-4">
        <h3>Votes:</h3>
        {Object.entries(votes)
          .sort(([userA], [userB]) => userA.localeCompare(userB))
          .map(([user, vote]) => (
          <div key={user}>
            {
              <>
                {user}:{" "}
                {showVotes.current || name === user
                  ? vote
                  : vote === ""
                  ? ""
                  : "√"}
              </>
            }
          </div>
        ))}
      </div>
    </section>
  );
};

export default VotePage;
