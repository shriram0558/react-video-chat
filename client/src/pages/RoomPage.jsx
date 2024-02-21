import ReactPlayer from "react-player";
import { useEffect, useCallback, useState } from "react";
import peer from "../services/peer";
import { useSocket } from "../context/SocketProvider";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RoomPage = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const { roomId } = useParams();

  const handleUserJoined = useCallback(({ id }) => {
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccpeted = useCallback(
    ({ ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleNegoIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleEndCall = useCallback(() => {
    setMyStream(null);
    setRemoteStream(null);
    setRemoteSocketId(null);
    peer.peer.close();
    socket.disconnect();
    socket.emit("user:left", { to: remoteSocketId });
    navigate("/");
  }, [remoteSocketId, socket, navigate]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (e) => {
      setRemoteStream(e.streams[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccpeted);
    socket.on("peer:nego:needed", handleNegoIncoming);
    socket.on("peer:nego:final", handleNegoFinal);
    socket.on("user:left", handleEndCall);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccpeted);
      socket.off("peer:nego:needed", handleNegoIncoming);
      socket.off("peer:nego:final", handleNegoFinal);
      socket.off("user:left", handleEndCall);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccpeted,
    handleNegoIncoming,
    handleNegoFinal,
    handleEndCall
  ]);

  return (
    <>
      {myStream && remoteStream ? (
        <main className="h-screen flex flex-col">
          <div className="h-[87%] flex items-center justify-center relative">
            <div className="h-[92%] w-auto relative">
              <ReactPlayer
                height="100%"
                width="100%"
                playing={true}
                style={{
                  borderRadius: "1rem",
                  overflow: "hidden"
                }}
                url={myStream}
              />
              <div className="h-[20%] w-auto absolute right-3 bottom-3">
                <ReactPlayer
                  height="100%"
                  width="100%"
                  style={{
                    borderRadius: "1rem",
                    overflow: "hidden"
                  }}
                  playing={true}
                  url={remoteStream}
                />
              </div>
            </div>
          </div>
          <div className="h-[13%] flex justify-around items-center">
            <div className="flex gap-11 bg-[#f4f4f4] h-auto px-4 py-2 rounded-lg">
              <div className="flex gap-2 items-center">
                <div className="w-[30px] h-auto">
                  <img src="/connected.svg" alt="" />
                </div>
                <p>Connected</p>
              </div>
              <div className="flex gap-1">
                <p>Room</p>
                <p className="text-[#7B00DB]">{roomId}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={sendStreams}
                className="flex items-center gap-2 text-md text-[#388E3C] rounded-3xl px-4 py-1 border-[1.2px] border-solid border-[#388E3C]"
              >
                <img src="/send-stream.svg" alt="" />
                <p>Send Stream</p>
              </button>
              <button
                onClick={handleEndCall}
                className="flex gap-2 items-center px-3 py-1 border-[1.2px] border-solid border-[#ff1515] rounded-3xl"
              >
                <img src="/end-call.svg" alt="" />
                <p>End</p>
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="h-screen flex flex-col">
          <div className="h-[82%] relative flex justify-center">
            <img
              className="w-[25%] h-auto absolute right-8 bottom-0"
              src="/room-img.webp"
              alt=""
            />

            <div className="mt-16 w-[80%] flex justify-start items-center flex-col gap-5">
              <div className="flex gap-2 justify-start mr-auto">
                <img src="/logo.svg" alt="" />
                <h3 className="text-4xl">VidChat</h3>
              </div>
              <div className="flex gap-2 items-end">
                <p className="text-3xl">Room</p>
                <p className="text-4xl text-[#7B00DB]">{roomId}</p>
              </div>
              <div className="flex gap-2 items-end">
                {remoteSocketId && <img src="/connected.svg" alt="" />}
                <p className="text-xl">
                  {remoteSocketId ? "Connected" : "No one in Room"}
                </p>
              </div>
              <div className="flex gap-10">
                {myStream && (
                  <button
                    onClick={sendStreams}
                    className="flex items-center gap-2 text-md text-[#388E3C] rounded-3xl px-4 py-1 border-[1.2px] border-solid border-[#388E3C]"
                  >
                    <img src="/send-stream.svg" alt="" />
                    <p>Send Stream</p>
                  </button>
                )}
                {remoteSocketId && (
                  <button
                    onClick={handleCallUser}
                    className="flex items-center gap-2 text-md text-[#388E3C] rounded-3xl px-4 py-1 border-[1.2px] border-solid border-[#388E3C]"
                  >
                    <img src="/call.svg" alt="" />
                    <p>Call</p>
                  </button>
                )}
              </div>
              {myStream && (
                <div className="flex flex-col items-center gap-2">
                  <p>My Stream</p>
                  <div className="w-[30%] h-auto">
                    <ReactPlayer
                      height="100%"
                      width="100%"
                      playing={true}
                      style={{
                        borderRadius: "1rem",
                        overflow: "hidden"
                      }}
                      url={myStream}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-[18%] bg-[#7B00DB]"></div>
        </main>
      )}
    </>
  );
};

export default RoomPage;
