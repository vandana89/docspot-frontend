import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/admin/doctors");
      setDoctors(res.data);
    } catch (err) {
      setMessage("❌ Failed to load doctors");
    }
  };

  const approveDoctor = async (doctorId) => {
    try {
      await API.put(`/admin/approve/${doctorId}`);
      setMessage("✅ Doctor approved");
      fetchDoctors();
    } catch (err) {
      setMessage("❌ Approval failed");
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const approvedCount = doctors.filter(d => d.isApproved).length;
  const pendingCount = doctors.length - approvedCount;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>Manage registered doctors efficiently</p>
      </header>

      <div className="stats-cards">
        <div className="card approved">✅ Approved: {approvedCount}</div>
        <div className="card pending">⏳ Pending: {pendingCount}</div>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="doctor-table">
        <h2>👨‍⚕️ All Doctors</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc._id}>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td>
                  {doc.isApproved ? (
                    <span className="badge approved">Approved</span>
                  ) : (
                    <span className="badge pending">Pending</span>
                  )}
                </td>
                <td>
                  {!doc.isApproved ? (
                    <button
                      className="btn-approve"
                      onClick={() => approveDoctor(doc._id)}
                    >
                      Approve
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
