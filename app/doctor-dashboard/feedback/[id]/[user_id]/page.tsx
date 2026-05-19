"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type User = {
  user_id: number;
  name: string;
  email: string;
  profile_image?: string | null;
};

const FeedbackPage = () => {
  const { id, user_id } = useParams();
  const router = useRouter();

  const [doctorName, setDoctorName] = useState("");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const doctorId = localStorage.getItem("user_id");

    if (!doctorId) return;

    fetch(`http://localhost:5000/api/doctor/get-by-id/${doctorId}`)
      .then((res) => res.json())
      .then((data: User) => setUser(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const doctorId = localStorage.getItem("user_id");
    if (comment.trim() === "") {
      toast.error("Please enter your feedback before submitting.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/doctor/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prediction_id: id,
        user_id: user_id,
        doctor_id: doctorId,
        doctor_name: user?.name || doctorName,
        comment: comment,
      }),
    });

    if (res.ok) {
      toast.success("Feedback submitted successfully!");
      setTimeout(() => {
        router.push("/doctor-dashboard/reports");
      }, 500);
    } else {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 relative">
      {/* BACK BUTTON */}
      <button
        onClick={() => router.push("/doctor-dashboard/reports")}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-purple-600"
      >
        <ArrowLeft size={20} />
        Back to Reports
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-[400px]"
      >
        <h2 className="text-xl font-bold mb-4">Doctor Feedback</h2>

        {/* INFO */}
        <div className="mb-4 text-sm text-gray-600">
          <p>Prediction ID: {id}</p>
          <p>User ID: {user_id}</p>
        </div>

        {/* DOCTOR NAME */}
        <div className="mb-3">
          <h3 className="font-semibold">Doctor Name</h3>
          <p className="text-gray-500">{user?.name || "Loading..."}</p>
        </div>

        {/* COMMENT */}
        <textarea
          placeholder="Write your feedback..."
          className="w-full border p-2 mb-3 rounded"
          onChange={(e) => setComment(e.target.value)}
        />

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Submit Feedback
        </button>
      </form>
      <Toaster position="top-center" />
    </div>
  );
};

export default FeedbackPage;
