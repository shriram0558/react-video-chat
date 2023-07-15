import ReactPlayer from "react-player";
import PropTypes from "prop-types";

const Streams = ({ myStream, remoteStream }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-20 items-center justify-center">
      {myStream && (
        <div className="flex justify-center flex-col items-center lg:w-[30%] w-[78%]">
          <h1 className="text-xl text-yellow-200">My Stream</h1>
          <div className="p-6 pt-3">
            <ReactPlayer
              height="100%"
              width="100%"
              url={myStream}
              playing={true}
            />
          </div>
        </div>
      )}
      {remoteStream && (
        <div className="flex justify-center flex-col items-center lg:w-[30%] w-[78%]">
          <h1 className="text-xl text-yellow-200">Remote Stream</h1>
          <div className="p-6 pt-3 overflow-clip">
            <ReactPlayer
              height="100%"
              width="100%"
              url={remoteStream}
              playing={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

Streams.propTypes = {
  myStream: PropTypes.any,
  remoteStream: PropTypes.any,
};

export default Streams;
