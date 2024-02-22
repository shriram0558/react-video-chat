import { useNavigate } from 'react-router-dom'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <main className="h-screen flex justify-end">
      <div className="w-[32%] flex flex-col justify-center gap-5">
        <p className="text-xl">Welcome to</p>
        <div className="flex gap-2">
          <img src="/logo.svg" alt="Logo" />
          <h3 className="text-4xl">VidChat</h3>
        </div>
        <p className="text-2xl">
          The all new Video Chat App for{' '}
          <span className="text-primary">Peer to Peer</span> video call
          conferencing
        </p>
        <div>
          <button
            onClick={() => navigate('/login')}
            className="w-auto bg-primary px-5 py-2 rounded-full text-white text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="w-[60%] landing-page-img-div bg-center bg-no-repeat bg-cover"></div>
    </main>
  )
}

export default LandingPage
