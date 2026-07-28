import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { AllFlightsPage} from "./pages/AllFlightsPage";
import { AvailableFlightsPage } from "./pages/AvailableFlightsPage";
import { MyBookingsPage} from "./pages/MyBookingsPage";

function App() {
  return (
      <>
      <Navbar />
      <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<AllFlightsPage />} />
        <Route path="/flights/available" element={<AvailableFlightsPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Routes>
        </main>
      </>
  );
}

export default App;