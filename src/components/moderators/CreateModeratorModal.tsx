"use client";

import { useState } from "react";
import { registerUser } from "@/services/authService";
import { FaTimes } from "react-icons/fa";
import Snackbar from "../SnackBar";
import ImageUploader from "../ImageUploader";

interface Props {
  onClose: () => void;
}

export default function CreateModeratorModal({ onClose }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    password: "",
    pfpUrl: "",
    role: "normal"
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "success" as "success" | "error"
  });

  const validateEmail = (email: string) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) validationErrors.name = "Name is required";
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      validationErrors.email = "Enter a valid email address";
    }
    if (!formData.age) validationErrors.age = "Age is required";
    if (!formData.password.trim()) validationErrors.password = "Password is required";
    if (!formData.pfpUrl.trim()) validationErrors.pfpUrl = "Profile picture URL is required";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await registerUser(
        formData.name,
        formData.email,
        Number(formData.age),
        formData.password,
        formData.role,
        formData.pfpUrl
      );

      if (response.token) {
        setSnackbar({
          show: true,
          message: "Moderator created successfully",
          type: "success"
        });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSnackbar({
          show: true,
          message: response.message || "Failed to create moderator",
          type: "error"
        });
      }
    } catch (err) {
      setSnackbar({
        show: true,
        message: "Something went wrong. Please try again!"+err,
        type: "error"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50  ">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Moderator</h2>

        <form onSubmit={handleSubmit} className="space-y-4 h-[80vh] overflow-auto scrollbar-hide">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={`w-full p-2 border rounded text-gray-800 ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`w-full p-2 border rounded text-gray-800 ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="number"
              name="age"
              placeholder="Age"
              className={`w-full p-2 border rounded text-gray-800 ${
                errors.age ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}
              value={formData.age}
              onChange={handleInputChange}
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={`w-full p-2 border rounded text-gray-800 ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:border-blue-500 focus:outline-none`}
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <ImageUploader
              onUpload={(url) => {
                setFormData(prev => ({ ...prev, pfpUrl: url }));
                setErrors(prev => ({ ...prev, pfpUrl: "" }));
              }}
              onRemove={() => {
                setFormData(prev => ({ ...prev, pfpUrl: "" }));
              }}
              initialImage={formData.pfpUrl}
            />
            {errors.pfpUrl && <p className="text-red-500 text-sm mt-1">{errors.pfpUrl}</p>}
          </div>

          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded text-gray-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="normal">Normal Moderator</option>
              <option value="super">Super Moderator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-secondary hover:bg-third text-black p-2 rounded transition duration-300"
          >
            Create Moderator
          </button>
        </form>

        <Snackbar
          show={snackbar.show}
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(prev => ({ ...prev, show: false }))}
        />
      </div>
    </div>
  );
}
