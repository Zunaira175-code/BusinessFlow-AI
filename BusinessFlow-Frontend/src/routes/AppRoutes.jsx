import { Routes, Route } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <h1 className="text-5xl font-bold text-blue-600 text-center mt-20">
            BusinessFlow AI
          </h1>
        }
      />
    </Routes>
  );
}

export default AppRoutes;