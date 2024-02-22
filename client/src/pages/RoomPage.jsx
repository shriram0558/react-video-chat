import { useEffect, useCallback, useState } from 'react'
import peer from '../services/peer'
import { useSocket } from '../context/SocketProvider'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import VideoCallScreen from '../components/VideoCallScreen'
import RoomLobby from '../components/RoomLobby'

const RoomPage = () => {
  const socket = useSocket()
  const navigate = useNavigate()
  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [myStream, setMyStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)

  const { roomId } = useParams()

  const handleUserJoined = useCallback(({ id }) => {
    setRemoteSocketId(id)
  }, [])

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })
    const offer = await peer.getOffer()
    socket.emit('user:call', { to: remoteSocketId, offer })
    setMyStream(stream)
  }, [remoteSocketId, socket])

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setMyStream(stream)
      const ans = await peer.getAnswer(offer)
      socket.emit('call:accepted', { to: from, ans })
    },
    [socket],
  )

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream)
    }
  }, [myStream])

  const handleCallAccpeted = useCallback(
    ({ ans }) => {
      peer.setLocalDescription(ans)
      sendStreams()
    },
    [sendStreams],
  )

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer()
    socket.emit('peer:nego:needed', { to: remoteSocketId, offer })
  }, [remoteSocketId, socket])

  const handleNegoIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer)
      socket.emit('peer:nego:done', { to: from, ans })
    },
    [socket],
  )

  const handleNegoFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans)
  }, [])

  const handleEndCall = useCallback(async () => {
    peer.peer.close()
    socket.emit('user:left', { to: remoteSocketId })
    socket.disconnect()

    setMyStream(null)
    setRemoteStream(null)
    setRemoteSocketId(null)

    navigate('/')
    window.location.reload()
  }, [remoteSocketId, socket, navigate])

  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  }, [handleNegoNeeded])

  useEffect(() => {
    peer.peer.addEventListener('track', async (e) => {
      setRemoteStream(e.streams[0])
    })
  }, [])

  useEffect(() => {
    socket.on('user:joined', handleUserJoined)
    socket.on('incoming:call', handleIncomingCall)
    socket.on('call:accepted', handleCallAccpeted)
    socket.on('peer:nego:needed', handleNegoIncoming)
    socket.on('peer:nego:final', handleNegoFinal)
    socket.on('user:left', handleEndCall)

    return () => {
      socket.off('user:joined', handleUserJoined)
      socket.off('incoming:call', handleIncomingCall)
      socket.off('call:accepted', handleCallAccpeted)
      socket.off('peer:nego:needed', handleNegoIncoming)
      socket.off('peer:nego:final', handleNegoFinal)
      socket.off('user:left', handleEndCall)
    }
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccpeted,
    handleNegoIncoming,
    handleNegoFinal,
    handleEndCall,
  ])

  return (
    <>
      {remoteStream ? (
        <VideoCallScreen
          roomId={roomId}
          myStream={myStream}
          remoteStream={remoteStream}
          sendStreams={sendStreams}
          handleEndCall={handleEndCall}
        />
      ) : (
        <RoomLobby
          roomId={roomId}
          remoteSocketId={remoteSocketId}
          myStream={myStream}
          sendStreams={sendStreams}
          handleCallUser={handleCallUser}
        />
      )}
    </>
  )
}

export default RoomPage
