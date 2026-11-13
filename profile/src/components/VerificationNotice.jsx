import { FiInfo, FiCheckCircle } from "react-icons/fi";

export default function VerificationNotice() {
  return (
    <>
      {/* Info notice */}
      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <FiInfo className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-blue-700 text-xs leading-relaxed">
          This profile serves as digital verification of employment status and identity for the
          holder of the associated Bolt Nigeria staff ID card.
        </p>
      </div>

      {/* QR verification section */}
      <div className="mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col items-center gap-2">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#34D186" }}
        >
          <FiCheckCircle className="text-white" size={24} />
        </div>
        <p className="text-gray-800 font-semibold text-sm">Identity successfully verified</p>
        <p className="text-gray-400 text-xs">Last Updated: June 2026</p>
      </div>
    </>
  );
}
