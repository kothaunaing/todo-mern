import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ path = "/" }: { path: string }) => {
  return <Navigate to={path} />;
};

export default ProtectedRoute;
