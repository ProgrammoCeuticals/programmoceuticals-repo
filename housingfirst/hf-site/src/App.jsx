import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { BackToTop } from "./components/UI.jsx";
import HomePage from "./pages/HomePage.jsx";
import PropertiesPage from "./pages/PropertiesPage.jsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.jsx";
import InvestmentsPage from "./pages/InvestmentsPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

const PAGES = {
  home: HomePage,
  properties: PropertiesPage,
  "property-detail": PropertyDetailPage,
  investments: InvestmentsPage,
  projects: ProjectsPage,
  about: AboutPage,
  services: ServicesPage,
  contact: ContactPage,
};

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const go = (key) => {
    setPage(key);
    document.getElementById("hf-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const viewProperty = (p) => {
    setSelectedProperty(p);
    go("property-detail");
  };

  const toggleFav = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  useEffect(() => {
    const scroller = document.getElementById("hf-scroll");
    if (!scroller) return;
    const onScroll = () => setScrolled(scroller.scrollTop > 40);
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  const sharedProps = { go, viewProperty, favorites, toggleFav, property: selectedProperty };

  return (
    <div
      id="hf-scroll"
      className="h-full overflow-y-auto overflow-x-hidden flex flex-col"
      style={{ fontFamily: "Inter, sans-serif", color: "#1E293B", background: "#fff" }}
    >
      <Navbar page={page} go={go} scrolled={scrolled || page !== "home"} />
      <main key={page} className="animate-fade-in flex-1">
        {Object.entries(PAGES).map(([key, Page]) =>
          page === key ? <Page key={key} {...sharedProps} /> : null
        )}
      </main>
      <Footer go={go} />
      <BackToTop />
    </div>
  );
}
