import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";

const MovieDetail = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const [movie, setMovie] = useState<any>({});
  const [reviews, setReviews] = useState<any>([]);
  const [newReview, setNewReview] = useState<any>("");
  const getMovieById = async () => {
    try {
      const response = await api.get(`${URL_BE}/movie/${id}`, {
        headers: authHeader(),
      });
      if (response?.data) setMovie(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getReviewByMovie = async () => {
    try {
      const response = await api.get(
        `${URL_BE}/review/findReviewByMovieId/${id}`,
        {
          headers: authHeader(),
        }
      );
      if (response?.data) setReviews(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMovieById();
    getReviewByMovie();
  }, [id]);

  // useEffect(() => {
  //   fetch(`${URL_BE}/review/${id}/reviews`)
  //     .then((response) => response.json())
  //     .then((data) => setReviews(data))
  //     .catch((error) => console.error(error));
  // }, [id]);

  const submitReview = async () => {
    if (localStorage.getItem("access_token") != null) {
      try {
        const response = await api.post(
          `${URL_BE}/review/${id}`,
          newReview.trim(),
          {
            headers: {
              "Content-Type": "text/plain",
              ...authHeader(),
            },
          }
        );
        if (response?.data) {
          getReviewByMovie();
          setNewReview("");
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "A Review Has been Created !",
              step: 1,
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Ban can Dang nhap de them binh luan");
    }
  };
  const navigate = useNavigate();

  return (
    <div className="grid-container">
      {movie && (
        <div className="movie-details">
          <div className="movie__title">
            category: {movie?.categoryMovie?.title}
          </div>
          <div className="movie__title">name: {movie?.title}</div>
          <img className="movie__poster" src={movie?.poster} alt="poster" />
        </div>
      )}
      <div className="review-list">
        <div>
          <h1>Review List</h1>
          <div className="review__list">
            {reviews.map((review: any) => (
              <div className="review__item" key={review.id}>
                <p>{review.body}</p>
                <Button
                  onClick={() => {
                    navigate(`/review-detail?id=${review?.id}`);
                  }}
                  variant="primary"
                  type="submit"
                >
                  Detail
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="review-form">
          <h2>Submit Review</h2>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Enter your review..."
            onKeyDown={(event) => {
              if (event.code === "Enter") {
                submitReview();
              }
            }}
          ></textarea>
          <Button onClick={submitReview}>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
