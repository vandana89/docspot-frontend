import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/PatientDashboard.css";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [medicalDocs, setMedicalDocs] = useState(null);
  const [message, setMessage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch appointments
  useEffect(() => {
    axios
      .get("/api/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAppointments(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Fetch approved doctors
  useEffect(() => {
    axios
      .get("/api/doctors/approved", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const approved = res.data.filter((doc) => doc.isApproved);
        setDoctors(approved);
      })
      .catch((err) => console.error("Error loading doctors:", err));
  }, [token]);

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("doctorId", doctorId);
      formData.append("appointmentDate", appointmentDate);
      formData.append("reason", reason);
      if (medicalDocs) {
        formData.append("medicalDocs", medicalDocs);
      }

      await axios.post("/api/appointments/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ Appointment booked successfully!");

      // Refresh appointments
      const updated = await axios.get("/api/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(updated.data);

      // Reset form
      setDoctorId("");
      setAppointmentDate("");
      setReason("");
      setMedicalDocs(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to book appointment.");
    }
  };

  return (
    <div className="patient-dashboard">
      <header className="patient-header">
        <h1>👋 Welcome Back, Patient</h1>
        <p>Your Appointments Overview</p>
      </header>

      <section className="booking-form">
        <h2>📅 Book New Appointment</h2>
        <form onSubmit={handleBooking}>
          {/* Doctor dropdown */}
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          >
            <option value="">Select a Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} - {doc.profile?.specialization || "Doctor"}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <input
            type="file"
            onChange={(e) => setMedicalDocs(e.target.files[0])}
          />

          <button type="submit">Book Appointment</button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>

      <section className="appointments-section">
        <h2>📋 Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className="no-data">No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div className="appointment-card" key={appt._id}>
              <h3>Doctor: {appt.doctorId?.name || "Unknown"}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(appt.appointmentDate).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${appt.status}`}>{appt.status}</span>
              </p>
              <p><strong>Reason:</strong> {appt.reason}</p>
              <p><strong>Docs:</strong> {appt.medicalDocs}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
