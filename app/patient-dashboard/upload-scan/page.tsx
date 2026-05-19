"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const UploadScan = () => {
  const router = useRouter();

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!image) return toast.error("Please upload a scan first");

    const userId = localStorage.getItem("user_id");

    if (!userId) {
      return toast.error("User not logged in");
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("user_id", userId);

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/patient/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Prediction failed");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
        {/* BACK */}
        <button
          onClick={() => router.push("/patient-dashboard/dashboard")}
          className="flex items-center gap-2 text-gray-600 mb-4"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-xl font-bold mb-4 text-gray-900">
          Upload Lung Scan
        </h1>

        {/* FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImage(file);
              setPreview(URL.createObjectURL(file));
              setResult(null);
            }
          }}
          className="text-gray-700"
        />

        {/* PREVIEW */}
        {preview && (
          <img
            src={preview}
            className="w-full h-60 object-cover mt-4 rounded-lg"
          />
        )}

        {/* BUTTON */}
        <button
          onClick={handlePredict}
          className="bg-purple-500 text-white w-full py-2 mt-4 rounded-lg"
        >
          {loading ? "Analyzing scan..." : "Predict"}
        </button>

        {/* RESULT CARD */}
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-bold text-green-700">
              {result.predicted_class}
            </h2>

            <p className="text-gray-700 mt-1">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </p>

            {/* warning style for unknown */}
            {result.predicted_class.includes("Unknown") && (
              <p className="text-red-500 mt-2">
                Please upload a valid CT scan image.
              </p>
            )}
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default UploadScan;
