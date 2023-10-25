import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import Trailer from "./components/trailer/Trailer";
import NotFound from "./components/notFound/NotFound";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Home from "./pages/Home/Home";
import ReviewDetail from "./pages/ReviewDetail/ReviewDetail";
import Toast from "./components/LoadingError/Toast";
import CategoryList from "./pages/CategoryList/CategoryList";
import CategoryCreate from "./pages/CategoryCreate/CategoryCreate";
import MovieList from "./pages/MovieList/MovieList";
import Cart from "./pages/Cart/Cart";
import { useEffect } from "react";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import OrderList from "./pages/OrderList/OrderList";
import OrderDetail from "./pages/OrderDetail/OrderDetail";

function App() {
  const navigate = useNavigate();

  // console.log("dayy la movie", movies);
  const pathname = window.location.pathname;
  useEffect(() => {
    if (pathname === "/") navigate("/home");
  }, [pathname]);
  return (
    <div className="App">
      {pathname !== "/login" && pathname !== "/register" && <Header />}
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/home" element={<Home />}></Route>
        <Route path="/Trailer/:ytTrailerId" element={<Trailer />}></Route>
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/category-create" element={<CategoryCreate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update-profile" element={<Profile />} />
        <Route path="/movie-list" element={<MovieList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-list" element={<OrderList />} />
        <Route path="/order-detail/:id" element={<OrderDetail />} />
        <Route path="/review-detail" element={<ReviewDetail />} />
        <Route path="*" element={<NotFound />}></Route>
        {/* </Route> */}
      </Routes>
      <Toast />
    </div>
  );
}

export default App;
