import ReactPlayer from 'react-player'
import PropTypes from 'prop-types'

const VideoCallScreen = ({
  roomId,
  myStream,
  remoteStream,
  sendStreams,
  handleEndCall,
}) => {
  return (
    <main className="h-screen flex flex-col">
      <div className="h-[87%] flex items-center justify-center relative">
        <div className="h-[92%] w-auto relative">
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
          <div className="h-[20%] w-auto absolute right-3 bottom-3">
            <ReactPlayer
              url={remoteStream}
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
      </div>
      <div className="h-[13%] flex justify-around items-center">
        <div className="flex gap-11 bg-[#f4f4f4] h-auto px-4 py-2 rounded-lg">
          <div className="flex gap-2 items-center">
            <div className="w-[30px] h-auto">
              <img src="/connected.svg" alt="Connected" />
            </div>
            <p>Connected</p>
          </div>
          <div className="flex gap-1">
            <p>Room</p>
            <p className="text-secondary">{roomId}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={sendStreams}
            className="flex items-center gap-2 text-md text-[#388E3C] rounded-3xl px-4 py-1 border-[1.2px] border-solid border-[#388E3C]"
          >
            <img src="/send-stream.svg" alt="Send" />
            <p>Share Video</p>
          </button>
          <button
            onClick={handleEndCall}
            className="flex gap-2 items-center px-3 py-1 border-[1.2px] border-solid border-[#ff1515] rounded-3xl"
          >
            <img src="/end-call.svg" alt="End" />
            <p>End</p>
          </button>
        </div>
      </div>
    </main>
  )
}

VideoCallScreen.propTypes = {
  roomId: PropTypes.string.isRequired,
  myStream: PropTypes.any.isRequired,
  remoteStream: PropTypes.any.isRequired,
  sendStreams: PropTypes.func.isRequired,
  handleEndCall: PropTypes.func.isRequired,
}

export default VideoCallScreen
