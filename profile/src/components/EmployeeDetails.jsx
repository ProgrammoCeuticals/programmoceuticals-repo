import { FiMapPin, FiCalendar, FiHash, FiShield } from "react-icons/fi";

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="text-gray-400" size={15} />
    </div>
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="text-gray-800 text-sm font-medium">{value}</p>
    </div>
  </div>
);

export default function EmployeeDetails({ employee }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-3">
      <Row icon={FiHash} label="Employee ID" value={employee.employeeId} />
      <Row icon={FiShield} label="Position" value={employee.position} />
      <Row icon={FiMapPin} label="Location" value={employee.location} />
      <Row icon={FiCalendar} label="Date Issued" value={employee.issueDate} />
      <Row icon={FiCalendar} label="Expiry Date" value={employee.expiryDate} />
      <Row icon={FiHash} label="Verification Code" value={employee.verificationCode} />
    </div>
  );
}
