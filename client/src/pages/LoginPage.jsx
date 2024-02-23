import CreateRoomForm from '../components/CreateRoomForm'

const LoginPage = () => {
  return (
    <main className="h-screen flex">
      <div className="w-[45%] flex flex-col justify-center gap-9 relative items-center">
        <div className="flex gap-2 justify-center">
          <img src="/logo.svg" alt="Logo" />
          <h3 className="text-4xl">VidChat</h3>
        </div>
        <div className="w-[80%] ">
          <img src="/login-img.webp" alt="Login" />
        </div>
      </div>
      <div className="w-[55%] bg-secondary flex justify-center items-center">
        <CreateRoomForm />
      </div>
    </main>
  )
}

export default LoginPage
