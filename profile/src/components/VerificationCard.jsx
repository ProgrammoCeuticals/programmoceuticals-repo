import { FiCheckCircle } from "react-icons/fi";
import StatusBadge from "./StatusBadge";

export default function VerificationCard({ employee }) {
  const initials = employee.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
      {/* Avatar */}
      <div className="relative inline-block mb-4">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold shadow-md"
          style={{ backgroundColor: "#34D186" }}
        >
          {initials}
        </div>
        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-2 border-white flex items-center justify-center shadow">
          <FiCheckCircle className="text-green-500" size={18} />
        </div>
      </div>

      <h2 className="text-gray-900 font-bold text-xl leading-tight">{employee.fullName}</h2>
      <p className="text-gray-500 text-sm mt-1 mb-3">{employee.position}</p>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          {employee.employeeId}
        </span>
        <StatusBadge status={employee.status} />
      </div>

      {/* Verified badge */}
      <div
        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold"
        style={{ backgroundColor: "#34D186" }}
      >
        <FiCheckCircle size={13} />
        VERIFIED BOLT NIGERIA STAFF
      </div>
    </div>
  );
}
