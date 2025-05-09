import { Loader2Icon } from "lucide-react";

const LoadingAuth = () => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Loader2Icon className="animate-spin" />
        <p className="font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingAuth;
