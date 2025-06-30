import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/BookAppointment.css";

export default function BookAppointment() {
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [medicalDocs, setMedicalDocs] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
  .get("/api/doctors/all", {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => {
    console.log("Fetched all doctors:", res.data);
    setDoctors(res.data); // ✅ Use all doctors, not just approved ones
  })
  .catch((err) => console.error("Error fetching doctors:", err));

     
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("appointmentDate", appointmentDate);
    formData.append("reason", reason);
    if (medicalDocs) {
      formData.append("medicalDocs", medicalDocs);
    }

    try {
      await axios.post("/api/appointments/book", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Appointment booked successfully!");
      setDoctorId("");
      setAppointmentDate("");
      setReason("");
      setMedicalDocs(null);
    } catch (err) {
      console.error(err);
      alert("Booking failed!");
    }
  };

  return (
    <div className="book-appointment-page">
      <div className="appointment-container">
        <h2>🩺 Book an Appointment</h2>
        <p>Schedule your appointment with confidence</p>

        <form onSubmit={handleSubmit}>
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

          <textarea
            placeholder="Reason for Appointment"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>

          <input
            type="file"
            onChange={(e) => setMedicalDocs(e.target.files[0])}
          />

          <button type="submit">Book Now</button>
        </form>
      </div>
    </div>
  );
}
