import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3e6f5] p-6">
      
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center p-10 md:p-14 space-y-6">
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Lung Cancer Detection System
            </h1>
            <p className="mt-3 text-gray-600 text-base md:text-lg">
              AI-powered platform to support early detection and medical decision-making.
              Select your role to continue.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="/patient-login"
              className="px-6 py-3 rounded-xl bg-purple-600 text-white text-center font-medium shadow-md hover:bg-purple-700 transition"
            >
              Patient
            </a>

            <a
              href="/doctor-login"
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-center font-medium shadow-md hover:bg-indigo-700 transition"
            >
              Doctor
            </a>

            <a
              href="/lab-assistant-login"
              className="px-6 py-3 rounded-xl bg-pink-600 text-white text-center font-medium shadow-md hover:bg-pink-700 transition"
            >
              Lab Assistant
            </a>
          </div>

          <p className="text-sm text-gray-400 pt-4">
            Secure access for authorized medical professionals only.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center p-10">
          
          <Image
            src="/assets/Wavy_Med-05_Single-01.jpg"
            alt="Lung Cancer Illustration"
            width={500}
            height={500}
            className="object-contain drop-shadow-2xl rounded-lg"
          />

        </div>

      </div>
    </div>
  );
}