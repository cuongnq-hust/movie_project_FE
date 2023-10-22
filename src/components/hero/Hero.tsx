import "./Hero.scss";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import { authHeader } from "../../auth";
import api from "../api/axiosConfig";
import { URL_BE } from "../../utils/constants";
import Icons from "./../../asset/circle.svg";
const Hero = () => {
  const [movies, setMovies] = useState<any>([]);

  const getAllMovie = async () => {
    try {
      const response = await api.get(`${URL_BE}/movie/all`, {
        headers: authHeader(),
      });
      if (response?.data) {
        let Movies_temp: any = response?.data ?? [];
        Movies_temp.sort((a: any, b: any) =>
          a.create_At > b.create_At ? -1 : b.create_At > a.create_At ? 1 : 0
        );
        setMovies(Movies_temp);
      }
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

  return (
    <div className="movie-carousel-container">
      <Carousel className="my-carousel">
        {movies?.map((movie: any) => {
          return (
            <Paper key={movie?.id}>
              <div className="movie-card-container">
                <div
                  className="movie-card"
                  style={{ backgroundImage: `url(${movie?.poster})` }}
                >
                  <div className="movie-detail">
                    <div className="movie-poster">
                      <img src={movie?.avatar} alt="" />
                    </div>
                    <div className="movie-title">
                      <h4>{movie?.title}</h4>
                    </div>
                    <div className="movie-buttons-container">
                      <Link
                        to={`/Trailer/${movie?.trailerLink.substring(
                          movie?.trailerLink.length - 11
                        )}`}
                      >
                        <div className="play-button-icon-container">
                          <div className="play-button-icon">
                            <img src={Icons} alt="Icons" />
                          </div>
                        </div>
                      </Link>
                      <div className="movie-review-button-container">
                        <Button
                          variant="warning"
                          onClick={() => toMovie(movie?.id)}
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
