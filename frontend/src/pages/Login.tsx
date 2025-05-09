import { AtSign, EyeIcon, EyeOff, LockIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import useError from "../hooks/useError";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setLoadingLogin, loadingLogin } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { error, showError } = useError();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email.trim()) {
      return showError("Email is a required field");
    }

    if (!password.trim()) {
      return showError("Password is a required field");
    }

    try {
      await login(email, password);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      showError(error.response.data.msg);
    } finally {
      setLoadingLogin(false);
    }
  };

  return (
    <div className="w-full flex-1 max-w-2xl mx-auto flex items-center justify-center">
      <div className="w-full m-2 shadow-lg border border-slate-300 p-4 rounded-2xl">
        <h2 className="text-center text-2xl font-semibold text-primary">
          Login To Your Account
        </h2>
        <form onSubmit={handleLogin} className="mt-2 space-y-2">
          <div>
            <p className="font-semibold mb-2">Email</p>
            <label className="input input-md w-full">
              <AtSign size={20} />
              <input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                type="email"
                value={formData.email}
                className="w-full"
                placeholder="Enter your email"
              />
            </label>
          </div>
          <div>
            <p className="font-semibold mb-2">Password</p>
            <label className="input input-md w-full">
              <LockIcon size={20} />
              <input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                value={formData.password}
                type={showPassword ? "text" : "password"}
                className="w-full"
                placeholder="Enter your password"
              />
              <span className="cursor-pointer" onClick={toggleShowPassword}>
                {showPassword ? <EyeOff size={20} /> : <EyeIcon size={20} />}
              </span>
            </label>
          </div>
          <div>{error && <p className="text-error">{error}</p>}</div>
          <button
            disabled={loadingLogin}
            type="submit"
            className="btn w-full btn-primary"
          >
            {loadingLogin ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-2">
          Don't have an account?{" "}
          <Link className="link link-primary" to={"/register"}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
