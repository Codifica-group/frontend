import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const storedToken = sessionStorage.getItem("token");

    if (!storedToken) {
        return <Navigate to="/error" replace />;
    }

    return children;
}
