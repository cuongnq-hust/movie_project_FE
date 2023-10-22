import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
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

function App() {
  // console.log("dayy la movie", movies);

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/Trailer/:ytTrailerId" element={<Trailer />}></Route>
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/category-list" element={<CategoryList />} />
        <Route path="/category-create" element={<CategoryCreate />} />
        <Route path="/movie-list" element={<MovieList />} />
        <Route path="/review-detail" element={<ReviewDetail />} />
        <Route path="*" element={<NotFound />}></Route>
        {/* </Route> */}
      </Routes>
      <Toast />
    </div>
  );
}

export default App;
