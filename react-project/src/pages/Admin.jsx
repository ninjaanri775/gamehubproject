import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [form, setForm] = useState({
    name: "",
    title: "",
    priceValue: "",
    priceText: "",
    location: "",
    discount: 0,
    category: "",
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState(""); // for API errors
  const [success, setSuccess] = useState(""); // optional success message

  const allowedCategories = [
    "tennis",
    "football",
    "padel",
    "carting",
    "warsoft",
    "MMA",
    "fitness halls",
    "gaming",
    "billiard",
    "table tennis",
    "arcade games"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();

    // Append only non-empty fields; skip title if empty
    Object.keys(form).forEach((key) => {
      if (key === "title" && !form[key]) return;
      formData.append(key, form[key]);
    });

    if (image) formData.append("image", image);

    try {
      const res = await fetch("http://localhost:5000/api/offers", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to create offer");
        return; // stop execution if error
      }

      setSuccess("Offer created successfully!");

      // Reset form
      setForm({
        name: "",
        title: "",
        priceValue: "",
        priceText: "",
        location: "",
        discount: 0,
        category: "",
      });
      setImage(null);
    } catch (err) {
      console.error("Error creating offer:", err);
      setError("Server error: " + err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-page" style={{ paddingTop: "80px" }}>
        <h1>Create Offer</h1>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title (optional)"
          />
          <input
            name="priceValue"
            value={form.priceValue}
            onChange={handleChange}
            placeholder="Price"
          />
          <input
            name="priceText"
            value={form.priceText}
            onChange={handleChange}
            placeholder="Price Text"
          />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
          />
          <input
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount"
          />
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select Category</option>
            {allowedCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input type="file" onChange={handleImageChange} />

          {/* Image preview */}
          {image && (
            <div style={{ marginTop: "10px" }}>
              <p>Selected Image Preview:</p>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{ width: "200px", height: "auto", borderRadius: "8px" }}
              />
            </div>
          )}

          <button type="submit">Create Offer</button>
        </form>
      </div>
    </div>
  );
}
