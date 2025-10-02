import { getToken } from "./utils/authUtil";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, redirectedTo }) {
  return getToken() ? children : <Navigate to={redirectedTo} />;
}

export default PrivateRoute;
