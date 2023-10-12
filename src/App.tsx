import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/header/header";
import Trailer from "./components/trailer/Trailer";
import NotFound from "./components/notFound/NotFound";
import { URL_BE } from "./constant/constant";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import api from "./components/api/axiosConfig";
import { authHeader } from "./auth";
import Home from "./pages/Home/Home";

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
        <Route path="*" element={<NotFound />}></Route>
        {/* </Route> */}
      </Routes>
    </div>
  );
}

export default App;
