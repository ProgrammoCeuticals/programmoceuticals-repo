export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#34D186" }}>
          <span className="text-white font-black text-lg leading-none">B</span>
        </div>
        <div>
          <h1 className="text-gray-900 font-bold text-base leading-tight">Staff Verification</h1>
          <p className="text-gray-500 text-xs">Official Employee Verification Portal</p>
        </div>
      </div>
    </header>
  );
}
