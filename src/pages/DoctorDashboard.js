import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/DoctorDashboard.css";
import Notifications from "../components/Notifications";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments/my");
        setAppointments(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch appointments", err);
        setMessage("❌ Failed to fetch appointments");
      }
    };
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/update/${id}`, { status });
      setMessage(`✅ Appointment marked as ${status}`);
      const updated = await API.get("/appointments/my");
      setAppointments(updated.data);
    } catch (err) {
      console.error("❌ Error updating appointment", err);
      setMessage("❌ Failed to update status");
    }
  };

  return (
    <div className="doctor-dashboard">
      <div className="top-section">
        <h1>🩺 Doctor Dashboard</h1>
        <Notifications />
      </div>

      {message && <p className="message">{message}</p>}
      <h3 className="appt-count">Total Appointments: {appointments.length}</h3>

      {appointments.length === 0 ? (
        <p className="no-appt">No Appointments Yet.</p>
      ) : (
        <div className="appointments-grid">
          {appointments.map((appt) => (
            <div key={appt._id} className="appt-card">
              <h3>
                Patient:{" "}
                {typeof appt.patientId === "object"
                  ? appt.patientId.name
                  : appt.patientId || "N/A"}
              </h3>
              <p>
                <strong>Email:</strong>{" "}
                {typeof appt.patientId === "object"
                  ? appt.patientId.email
                  : "N/A"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(appt.appointmentDate).toLocaleString()}
              </p>
              <p>
                <strong>Reason:</strong> {appt.reason}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${appt.status}`}>
                  {appt.status.toUpperCase()}
                </span>
              </p>
              {appt.medicalDocs && (
                <p>
                  <strong>Document:</strong>{" "}
                  <a
                    href={`http://localhost:5000/uploads/${appt.medicalDocs}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </p>
              )}

              <div className="status-actions">
                <button
                  className="btn confirm"
                  onClick={() => updateStatus(appt._id, "confirmed")}
                  disabled={appt.status === "confirmed"}
                >
                  ✅ Confirm
                </button>
                <button
                  className="btn reject"
                  onClick={() => updateStatus(appt._id, "rejected")}
                  disabled={appt.status === "rejected"}
                >
                  ❌ Reject
                </button>
                <button
                  className="btn complete"
                  onClick={() => updateStatus(appt._id, "completed")}
                  disabled={appt.status === "completed"}
                >
                  ✔️ Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
