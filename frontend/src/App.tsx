import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AllFlightsPage } from "./pages/AllFlightsPage";
import { AvailableFlightsPage } from "./pages/AvailableFlightsPage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { AboutPage } from "./pages/AboutPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/flights" element={<AllFlightsPage />} />
                    <Route path="/flights/available" element={<AvailableFlightsPage />} />
                    <Route path="/my-bookings" element={<MyBookingsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}

export default App;