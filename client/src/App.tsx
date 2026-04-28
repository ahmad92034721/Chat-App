import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protectedRoute";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

function App() {
  const loader = useSelector((state: RootState) => state.loaderReducer.loader);
  return (
    <div>
      <Toaster></Toaster>
      {loader && <Loader></Loader>}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
