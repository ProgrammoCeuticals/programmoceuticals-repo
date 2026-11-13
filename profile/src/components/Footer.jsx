export default function Footer() {
  return (
    <footer className="mt-6 pb-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#34D186" }}
        >
          <span className="text-white font-black text-xs">B</span>
        </div>
        <span className="text-gray-700 font-semibold text-sm">Bolt Nigeria</span>
      </div>
      <p className="text-gray-400 text-xs mb-1">This employee record has been verified.</p>
      <p className="text-gray-300 text-xs">© Bolt Nigeria</p>
    </footer>
  );
}
