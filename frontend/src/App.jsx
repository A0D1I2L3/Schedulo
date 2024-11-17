import { Routes, Route } from "react-router-dom";
import { WelcomePage } from "./pages/welcomePage.jsx";
import { LoginPage } from "./pages/loginPage.jsx";
import { SignUpPage } from "./pages/signUpPage.jsx";
import { ResetPasswordPage } from "./pages/resetPasswordPage.jsx";
import { RegisterPage } from "./pages/registrationPage.jsx";
import { ParticipantsPage } from "./pages/ParticipantsPage.jsx";
import AnimationComponent from "./pages/AnimationComponent.jsx";
import { HostPage } from "./pages/host.jsx";
import ViewPage from "./pages/viewPage.jsx";
import { HomeComponent } from "./pages/home.jsx";
import "./index.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/home" element={<HomeComponent />} />
        <Route
          path="/events/:eventId/participants"
          element={<ParticipantsPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
