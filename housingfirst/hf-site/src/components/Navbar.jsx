import { useState } from "react";
import { Building2, Search, Menu, X, ChevronDown } from "lucide-react";
import { NAV_LINKS, C } from "../data/index.js";
import { GoldButton } from "./UI.jsx";

export default function Navbar({ page, go, scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      go("properties");
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const close = () => setMobileOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass-nav shadow-lg" : "bg-transparent"}`}
      role="banner"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Main navigation">
        {/* Logo */}
        <button
          onClick={() => { go("home"); close(); }}
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded-lg"
          aria-label="HousingFirst — go to homepage"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: C.gold }}>
            <Building2 size={18} color={C.navy} aria-hidden="true" />
          </div>
          <span className="ff-display text-lg font-semibold text-white tracking-wide">HousingFirst</span>
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li
              key={link.key}
              className="relative"
              onMouseEnter={() => link.mega && setMegaOpen(true)}
              onMouseLeave={() => link.mega && setMegaOpen(false)}
            >
              <button
                onClick={() => !link.mega && go(link.key)}
                aria-current={page === link.key ? "page" : undefined}
                aria-haspopup={link.mega ? "true" : undefined}
                aria-expanded={link.mega ? megaOpen : undefined}
                className={`text-sm font-medium transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded px-1 py-0.5 ${
                  page === link.key ? "text-[#C9A227]" : "text-slate-200 hover:text-[#C9A227]"
                }`}
              >
                {link.label}
                {link.mega && <ChevronDown size={14} aria-hidden="true" className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />}
              </button>

              {link.mega && megaOpen && (
                <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-4" role="menu">
                  <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-4 shadow-2xl animate-fade-in">
                    {link.mega.map((item) => (
                      <button
                        key={item.label}
                        role="menuitem"
                        onClick={() => { go("services"); setMegaOpen(false); }}
                        className="flex items-start gap-3 rounded-xl p-3 text-left hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                      >
                        <item.icon size={18} style={{ color: C.gold }} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span>
                          <span className="block text-sm font-semibold text-slate-800">{item.label}</span>
                          <span className="block text-xs text-slate-500">{item.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="Toggle search"
            aria-expanded={searchOpen}
            className="rounded-full p-2 text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <Search size={18} aria-hidden="true" />
          </button>
          <GoldButton onClick={() => go("contact")} className="!py-2.5">Inquire Now</GoldButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[#0F172A] px-6 py-4 animate-fade-in">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-2xl items-center gap-3 rounded-full bg-white/10 px-4 py-2">
            <Search size={16} className="text-slate-300 shrink-0" aria-hidden="true" />
            <label htmlFor="site-search" className="sr-only">Search properties</label>
            <input
              id="site-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties, locations, projects…"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
              autoFocus
            />
            <button type="submit" className="text-xs text-[#C9A227] font-medium shrink-0 hover:underline">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-white/10 bg-[#0F172A] px-6 py-4 animate-fade-in">
          <ul className="flex flex-col gap-1 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <button
                  onClick={() => { go(link.key); close(); }}
                  aria-current={page === link.key ? "page" : undefined}
                  className={`w-full py-3 text-left text-sm font-medium border-b border-white/5 transition-colors ${
                    page === link.key ? "text-[#C9A227]" : "text-slate-200 hover:text-[#C9A227]"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <GoldButton onClick={() => { go("contact"); close(); }} className="mt-4 w-full justify-center">
            Inquire Now
          </GoldButton>
        </div>
      )}
    </header>
  );
}
