import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "../styles/PatientAppointments.css";

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("/api/appointments/mine", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error("❌ Failed to load appointments", err));
  }, [token]);

  const cancelAppointment = async (id) => {
    try {
      await axios.put(
        `/api/appointments/cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === id ? { ...appt, status: "cancelled" } : appt
        )
      );
    } catch (error) {
      console.error("❌ Error cancelling", error);
    }
  };

  return (
    <div className="appointments-container">
      <h2>📅 My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        appointments.map((appt) => (
          <div className="appt-card" key={appt._id}>
            <h4>👨‍⚕️ Doctor: {appt.doctorId?.name}</h4>
            <p>
              <strong>Email:</strong> {appt.doctorId?.email}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {moment(appt.appointmentDate).format("MMMM Do YYYY, h:mm A")}
            </p>
            <p>
              <strong>Reason:</strong> {appt.reason}
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
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${appt.status}`}>
                {appt.status}
              </span>
            </p>
            {appt.status !== "cancelled" && (
              <button onClick={() => cancelAppointment(appt._id)}>
                ❌ Cancel
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
