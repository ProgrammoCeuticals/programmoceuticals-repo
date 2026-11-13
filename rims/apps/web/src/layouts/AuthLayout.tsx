export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
      {/* Footer — GLSI app-footer style */}
      <footer className="bg-[#193441] py-2 text-center">
        <p className="text-[10px] text-white/40 uppercase tracking-[0.08em]">
          A ProgrammoCeuticals Product
        </p>
      </footer>
    </div>
  );
}
