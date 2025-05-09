import { AtSign, EyeIcon, EyeOff, LockIcon, UserIcon } from "lucide-react";
import { use, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import useError from "../hooks/useError";
import useAuthStore from "../stores/useAuthStore";

const RegisterPage = () => {
  const { register, loadingRegister, setLoadingRegister } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { error, showError } = useError();
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password, name } = formData;

    if (!name.trim()) {
      return showError("Name is a required field");
    }
    if (!email.trim()) {
      return showError("Email is a required field");
    }

    if (!password.trim()) {
      return showError("Password is a required field");
    }

    try {
      await register(name, email, password);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      showError(error.response.data.msg);
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto flex items-center justify-center w-full">
      <div className="w-full m-2 shadow-lg border border-slate-300 p-4 rounded-2xl">
        <h2 className="text-center text-2xl font-semibold text-primary">
          Create A New Account
        </h2>
        <form onSubmit={handleRegister} className="mt-2 space-y-2">
          <div>
            <p className="font-semibold mb-2">Name</p>
            <label className="input input-md w-full">
              <UserIcon size={20} />
              <input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                value={formData.name}
                className="w-full"
                placeholder="Enter your name"
              />
            </label>
          </div>
          <div>
            <p className="font-semibold mb-2">Email</p>
            <label className="input input-md w-full">
              <AtSign size={20} />
              <input
                type="email"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
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
          <button type="submit" className="btn w-full btn-primary">
            Register
          </button>
        </form>

        <p className="mt-2">
          Already have an account?{" "}
          <Link className="link link-primary" to={"/login"}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
