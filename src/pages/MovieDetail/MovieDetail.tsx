import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.scss";
import { URL_BE } from "../../constant/constant";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";

const MovieDetail = () => {
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
            headers: authHeader(),
          }
        );
        if (response?.data) {
          getReviewByMovie();
          setNewReview("");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Ban can Dang nhap de them binh luan");
    }
  };

  return (
    <div className="grid-container">
      <div className="movie-details">
        <h1>Movie Detail</h1>
        <h2>{movie.title}</h2>
        <img src={movie.poster} alt="" />
      </div>
      <div className="review-list">
        <div>
          <h1>Review List</h1>
          {reviews.map((review: any) => (
            <div key={review.id}>
              <p>{review.body}</p>
            </div>
          ))}
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
          <button onClick={submitReview}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
