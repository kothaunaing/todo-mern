import { Route, Routes } from "react-router-dom";
import HomeComponent from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Header from "./components/Header";
import useAppStore from "./stores/useAppStore";
import useAuthStore from "./stores/useAuthStore";
import { useEffect } from "react";
import LoadingAuth from "./components/LoadingAuth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { theme } = useAppStore();
  const { checkAuth, loadingAuth, user } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (loadingAuth) {
    return <LoadingAuth />;
  }

  return (
    <div data-theme={theme} className="min-h-screen flex flex-col ">
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomeComponent /> : <ProtectedRoute path="/login" />}
        />

        <Route
          path="/login"
          element={user ? <ProtectedRoute path="/" /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={user ? <ProtectedRoute path="/" /> : <RegisterPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
