import CreateRoomForm from "../components/CreateRoomForm";

const LobbyPage = () => {
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen gap-10">
      <h1 className="text-7xl text-yellow-400">VidChat</h1>
      <CreateRoomForm />
    </div>
  );
};

export default LobbyPage;
