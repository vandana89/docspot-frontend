import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Notifications.css"; // optional: create this for styling

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/users/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotifications(res.data))
      .catch(console.error);
  }, [token]);

  return (
    <div className="notification-box">
      <h4>🔔 Notifications</h4>
      <ul>
        {notifications.map((n, i) => (
          <li key={i}>
            {n.message}{" "}
            <small>{new Date(n.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
