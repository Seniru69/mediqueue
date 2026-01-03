import Navbar from "../components/Navbar";

function Home() {
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  }

  return (
    <>
      <Navbar />
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">
          Welcome to Mediqueue 🏥
        </h1>

      

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Home;
