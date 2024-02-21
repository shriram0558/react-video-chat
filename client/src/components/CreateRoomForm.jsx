import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";

const CreateRoomForm = () => {
  const [ email, setEmail ] = useState("");
  const [ room, setRoom ] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [ email, room, socket ]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`, { state: { email, room } });
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [handleJoinRoom, socket]);

  return (
    <form
      onSubmit={handleSubmitForm}
      className="w-[60%] h-auto bg-[#E5C5FF] px-7 py-7 flex flex-col gap-8 rounded-2xl"
    >
      <div className="flex flex-col gap-1">
        <label className="text-md" htmlFor="email">
          Email:
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl px-4 py-1 outline-none placeholder:text-[#B7B7B7]"
          type="email"
          id="email"
          placeholder="abc@xyz.com"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-md" htmlFor="room">
          Room number:
        </label>
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="rounded-2xl px-4 py-1 outline-none placeholder:text-[#B7B7B7]"
          type="text"
          id="room"
          placeholder="123"
        />
      </div>
      <div className="flex justify-center">
        <button className="w-auto bg-[#7B00DB] px-5 py-2 rounded-full text-white text-lg">
          Join
        </button>
      </div>
    </form>
  );
};

export default CreateRoomForm;
