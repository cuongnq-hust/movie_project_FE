import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Header from "./components/header/header";
import Trailer from "./components/trailer/Trailer";
import NotFound from "./components/notFound/NotFound";
import { URLMOVIE } from "./constant/constant";
import MovieDetail from "./components/movieDetail/MovieDetail";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${URLMOVIE}/movies/allMovies`) // Thay đổi địa chỉ backend API tùy thuộc vào cấu hình port và endpoint của ứng dụng Spring Boot
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error(error));
  }, []);
  // console.log("dayy la movie", movies);

  return (
    <div className="App">
      <Header />
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        <Route path="/" element={<Home movies={movies} />}></Route>
        <Route path="/Trailer/:ytTrailerId" element={<Trailer />}></Route>
        <Route path="/movies/movie/:id" element={<MovieDetail />} />
        <Route path="*" element={<NotFound />}></Route>
        {/* </Route> */}
      </Routes>
    </div>
  );
}

export default App;
