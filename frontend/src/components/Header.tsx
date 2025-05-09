import clsx from "clsx";
import {
  LogInIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  User2Icon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useClickOutside from "../hooks/useClickOutside";
import useAppStore from "../stores/useAppStore";
import useAuthStore from "../stores/useAuthStore";

const title = [
  {
    letters: "TO",
    color: "text-primary",
  },
  {
    letters: "DO",
    color: "text-amber-500",
  },
  {
    letters: "WEB",
    color: "text-success",
  },
  {
    letters: "APP",
    color: "text-pink-500",
  },
];

const Header = () => {
  const { show, showRef, toggleShow } = useClickOutside();
  const { theme, toggleTheme } = useAppStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    toggleShow();
  };

  return (
    <header className="max-w-4xl mx-auto w-full">
      <div className="p-4 border-b border-b-base-300 md:rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <Link to={"/"}>
            <p className="font-semibold text-xl">
              {title.map((t) => (
                <span key={t.letters} className={clsx(t.color)}>
                  {t.letters}
                </span>
              ))}
            </p>
          </Link>
        </div>
        <div ref={showRef} className="relative">
          <button onClick={toggleShow} className="btn btn-lg btn-circle">
            <User2Icon />
          </button>
          {show && (
            <div className="absolute shadow-md border border-slate-200 rounded-2xl bg-base-100 p-4 top-full right-0 z-20">
              {user ? (
                <>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-slate-400">{user.email}</p>
                  <button onClick={handleLogout} className="btn mt-2">
                    <LogOutIcon />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link onClick={toggleShow} to={"/login"} className="btn">
                    <LogInIcon />
                    <span>Login</span>
                  </Link>
                </>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-t-base-300 pt-1">
                <span className="font-semibold">
                  {theme === "light" ? "Light" : "Dark"}{" "}
                </span>
                <button
                  data-tip={theme === "light" ? "Light mode" : "Dark mode"}
                  onClick={toggleTheme}
                  className="btn btn-circle tooltip "
                >
                  {theme === "dark" ? (
                    <MoonIcon size={20} />
                  ) : (
                    <SunIcon size={20} />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
