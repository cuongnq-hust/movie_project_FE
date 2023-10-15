import "./Hero.scss";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import { authHeader } from "../../auth";
import api from "../api/axiosConfig";
import { URL_BE } from "../../utils/constants";

const Hero = () => {
  const [movies, setMovies] = useState<any>([]);

  const getAllMovie = async () => {
    try {
      const response = await api.get(`${URL_BE}/movie/all`, {
        headers: authHeader(),
      });
      console.log(response);
      if (response?.data) setMovies(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllMovie();
  }, []);

  const navigate = useNavigate();
  function toMovie(movieId: any) {
    navigate(`/movie/${movieId}`);
  }
  const [title, setTitle] = useState<any>("");
  const [newImage, setNewImage] = useState<any>(null);
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };
  const handleImageChange = (event: any) => {
    setNewImage(event.target.files[0]);
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", newImage);

    try {
      const response = await api.post(`${URL_BE}/new/new`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTitle("");
      setNewImage(null);
      // console.log(response.data);
      // Xử lý phản hồi từ server nếu cần thiết
    } catch (error) {
      console.error(error);
    }
  };
  let classes = {
    carousel: {
      height: 200,
      width: 200,
    },
  };
  return (
    <div className="movie-carousel-container">
      <Carousel className="my-carousel">
        {movies?.map((movie: any) => {
          return (
            <Paper key={movie.id}>
              <div className="movie-card-container">
                <div
                  className="movie-card"
                  // style={{ "--img": `url(${movie.backdrops[0]})` }}
                >
                  <div className="movie-detail">
                    <div className="movie-poster">
                      <img src={movie.poster} alt="" />
                    </div>
                    <div className="movie-title">
                      <h4>{movie.title}</h4>
                    </div>
                    <div className="movie-buttons-container">
                      <Link
                        to={`/Trailer/${movie.trailerLink.substring(
                          movie.trailerLink.length - 11
                        )}`}
                      >
                        <div className="play-button-icon-container">
                          <div className="play-button-icon">
                            FontAwesomeIcon
                          </div>
                        </div>
                      </Link>
                      <div className="movie-review-button-container">
                        <Button
                          variant="info"
                          onClick={() => toMovie(movie.id)}
                        >
                          Reviews
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Paper>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Hero;
