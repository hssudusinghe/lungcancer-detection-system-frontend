"use client";

import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";

type Feedback = {
  feedback_id: number;
  doctor_name: string;
  comment: string;
  prediction_id: number;
  user_id: number;
  created_at: string;
};

const ViewFeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetchFeedbacks();
    }
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      setLoading(true);

      const response = await fetch(
        `http://127.0.0.1:5000/api/patient/feedback/${userId}`,
      );

      const data = await response.json();

      if (data.success) {
        setFeedbacks(data.data);
      } else {
        setError(data.error || "Failed to fetch feedback");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3e6f5] text-gray-900 p-6">
      <a
        href="/patient-dashboard/patient"
        className="absolute top-4 left-4  flex items-center gap-2 text-gray-600 hover:text-purple-600"
      >
        <ArrowLeft size={20} />
        Back
      </a>
      {/* HEADER */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Doctor Feedback Reports
        </h1>

        {loading && (
          <div className="flex justify-center items-center">
            <p className="text-lg font-medium">Loading feedback...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* NO DATA */}
        {!loading && feedbacks.length === 0 && !error && (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-500 text-lg">No feedback available</p>
          </div>
        )}

        {/* FEEDBACK LIST */}
        <div className="space-y-5">
          {feedbacks.map((item) => (
            <div
              key={item.feedback_id}
              className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              {/* TOP SECTION */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Dr. {item.doctor_name}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Report ID: {item.prediction_id}
                  </p>
                </div>

                <div className="mt-2 md:mt-0">
                  <span className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* COMMENT */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 leading-relaxed">{item.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewFeedbackPage;
