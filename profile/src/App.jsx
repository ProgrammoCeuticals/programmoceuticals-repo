import employee from "./data/employee";
import Header from "./components/Header";
import VerificationCard from "./components/VerificationCard";
import EmployeeDetails from "./components/EmployeeDetails";
import VerificationNotice from "./components/VerificationNotice";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 pt-5">
        <VerificationCard employee={employee} />
        <EmployeeDetails employee={employee} />
        <VerificationNotice />
        <Footer />
      </main>
    </div>
  );
}
