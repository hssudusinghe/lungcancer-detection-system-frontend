"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const ViewReportPage = () => {
  const params = useParams();
  const id = Number(params.id);

  const [data, setData] = useState<any>(null);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!id) return;

  setLoading(true);

  Promise.all([
    fetch(`http://localhost:5000/api/patient/report/${id}`).then((res) =>
      res.json()
    ),
    fetch(`http://localhost:5000/api/patient/complete-feedback/${id}`).then(
      (res) => res.json()
    ),
  ])
    .then(([reportData, feedbackData]) => {
      setData(reportData);
      setFeedback(feedbackData?.data);

      console.log("Report:", reportData);
      console.log("Feedback:", feedbackData);
    })
    .catch((err) => {
      console.error("Error:", err);
    })
    .finally(() => {
      setLoading(false);
    });
}, [id]);

  const toPercentage = (value: number) => {
    return (value * 100).toFixed(2) + "%";
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5]">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading medical report...</p>
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-center mt-10">No report found</p>;

  const { report, features } = data;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5] p-4">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-xl overflow-hidden">
        {/* BACK BUTTON */}
        <a
          href="/doctor-dashboard/reports"
          className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-purple-600"
        >
          <ArrowLeft size={20} />
          Back
        </a>

        {/* HEADER */}
        <div className="p-6 border-b bg-purple-50">
          <h1 className="text-2xl font-bold text-purple-800">
            Medical Scan Report
          </h1>
          <p className="text-sm text-gray-500">Detailed AI analysis result</p>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row">
          {/* IMAGE */}
          <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
            {report?.medical_image ? (
              <img
                src={`data:image/png;base64,${report.medical_image}`}
                className="w-full max-w-md rounded-xl shadow-md border"
              />
            ) : (
              <p className="text-gray-400">No image available</p>
            )}
          </div>

          {/* DETAILS */}
          <div className="md:w-1/2 p-6 space-y-6">
            {/* RESULT */}
            <div className="bg-purple-100 p-4 rounded-xl">
              <h2 className="font-semibold text-purple-800 mb-2">
                Diagnosis Result
              </h2>
              <p className="text-gray-700">{report?.result}</p>
            </div>

            {/* FEATURES */}
            <div>
              <h2 className="font-semibold text-gray-500 mb-3">
                AI Analysis Features
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features?.map((f: any, i: number) => (
                  <div
                    key={i}
                    className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-sm text-gray-500">{f.feature_name}</p>
                    <p className="font-semibold text-gray-800">
                      {toPercentage(f.value)}
                    </p>
                  </div>
                ))}
              </div>
              {feedback && (
                <div className="bg-green-100 p-4 rounded-xl mt-4">
                  <h2 className="font-semibold text-green-800 mb-2">
                    Feedback
                  </h2>
                  <p className="text-gray-700">{feedback.comment}</p>
                </div>
              )}
            </div>
            <a
              href={
                report.respond_type === "complete"
                  ? undefined
                  : `/doctor-dashboard/feedback/${report.prediction_id}/${report.user_id}`
              }
              className={`mt-4 px-4 py-2 rounded-lg text-white transition ${
                report.respond_type === "complete"
                  ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {report.respond_type === "complete"
                ? "Feedback Completed"
                : "Give Feedback"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReportPage;
