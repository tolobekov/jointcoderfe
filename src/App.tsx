
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import HomePage from "@/components/HomePage";
import SignUpModal from "@/components/SignUpModal";
import LoginModal from "@/components/LoginModal";
import IDEApp from "./IDEApp";

export default function App() {
  return (
    <Router>
      <Routes>
        {/** 1️⃣ Exact “/” shows Homepage alone */}
        <Route path="/" element={<HomePage />} />

        {/** 
         * 2️⃣ /signup & /login get Homepage + Modal on top
         *    — group route has no “path”, so it only renders
         *      when one of its children matches.
         */}
        <Route
          element={
            <>
              <HomePage />
              <Outlet />  {/* SignUpModal or LoginModal */}
            </>
          }
        >
          <Route path="signup" element={<SignUpModal />} />
          <Route path="login" element={<LoginModal />} />
        </Route>

        {/* 3️⃣ IDE / dashboard routes */}
        <Route path="dashboard" element={<IDEApp />} />
        <Route path="session/:sessionId" element={<IDEApp />} />
      </Routes>
    </Router>
  );
}
