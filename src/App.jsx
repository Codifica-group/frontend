import './App.css'
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useAppNotifications } from "./hooks/useAppNotifications";

function App() {
  
  useAppNotifications();

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
