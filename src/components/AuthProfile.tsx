import { useAuth0 } from "@auth0/auth0-react";

const AuthProfile = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>No has iniciado sesión.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <img src={user?.picture} alt={user?.name} className="rounded-full w-32 h-32" />
      <h2 className="text-2xl font-bold">{user?.name}</h2>
      <p className="text-gray-700">{user?.email}</p>
      <button
        onClick={() => logout({ returnTo: window.location.origin })}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default AuthProfile;