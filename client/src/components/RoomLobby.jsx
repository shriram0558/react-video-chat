import ReactPlayer from 'react-player'
import PropTypes from 'prop-types'

const RoomLobby = ({
  roomId,
  remoteSocketId,
  myStream,
  sendStreams,
  handleCallUser,
}) => {
  return (
    <main className="h-screen flex flex-col">
      <div className="h-[82%] relative flex justify-center">
        <img
          className="w-[25%] h-auto absolute right-8 bottom-0"
          src="/room-img.webp"
          alt="Room"
        />

        <div className="mt-16 w-[80%] flex justify-start items-center flex-col gap-5">
          <div className="flex gap-2 justify-start mr-auto">
            <img src="/logo.svg" alt="Logo" />
            <h3 className="text-4xl">VidChat</h3>
          </div>
          <div className="flex gap-2 items-end">
            <p className="text-3xl">Room</p>
            <p className="text-4xl text-secondary">{roomId}</p>
          </div>
          <div className="flex gap-2 items-end">
            {remoteSocketId && <img src="/connected.svg" alt="Connected" />}
            <p className="text-xl">
              {remoteSocketId ? 'Connected' : 'No one in Room'}
            </p>
          </div>
          <div className="flex gap-10">
            {myStream && (
              <button
                onClick={sendStreams}
                className="flex items-center gap-2 text-md text-[#388E3C] rounded-3xl px-4 py-1 border-[1.2px] border-solid border-[#388E3C]"
              >
                <img src="/send-stream.svg" alt="Send" />
                <p>Share Video</p>
              </button>
            )}
            {remoteSocketId && (
              <button
                onClick={handleCallUser}
                className="flex items-center gap-2 text-md text-[#388E3C] rounded-3xl px-4 py-1 border-[1.2px] border-solid border-[#388E3C]"
              >
                <img src="/call.svg" alt="Call" />
                <p>Call</p>
              </button>
            )}
          </div>
          {myStream && (
            <div className="flex flex-col items-center gap-2">
              <p>My Stream</p>
              <div className="w-[30%] h-auto">
                <ReactPlayer
                  url={myStream}
                  playing={true}
                  height="100%"
                  width="100%"
                  style={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="h-[18%] bg-secondary"></div>
    </main>
  )
}

RoomLobby.propTypes = {
  roomId: PropTypes.string.isRequired,
  remoteSocketId: PropTypes.string.isRequired,
  myStream: PropTypes.any.isRequired,
  sendStreams: PropTypes.func.isRequired,
  handleCallUser: PropTypes.func.isRequired,
}

export default RoomLobby
