import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DoctorProfile.css";

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  if (!profile) return <p className="loading">Loading profile...</p>;

  return (
    <div className="doctor-profile">
      <h2>Your Profile</h2>
      <ul>
        <li><strong>Name:</strong> {profile.name}</li>
        <li><strong>Email:</strong> {profile.email}</li>
        <li><strong>Specialization:</strong> {profile.specialization}</li>
        <li><strong>Experience:</strong> {profile.experience} years</li>
        <li><strong>Location:</strong> {profile.location}</li>
        <li><strong>Fee:</strong> ₹{profile.fee}</li>
        <li><strong>Bio:</strong> {profile.bio}</li>
      </ul>
    </div>
  );
}
