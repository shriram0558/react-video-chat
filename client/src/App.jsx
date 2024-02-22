import { Route, Routes } from 'react-router-dom'
// import LobbyPage from "./pages/LobbyPage";
// import RoomPage from "./pages/RoomPage";
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RoomPage from './pages/RoomPage'
// import LobbyPage from "./pages/LobbyPage";

function App() {
  return (
    <div className="App h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  )
}

export default App
