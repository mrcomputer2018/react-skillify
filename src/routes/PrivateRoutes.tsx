import { Route, Routes } from "react-router";


export function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}