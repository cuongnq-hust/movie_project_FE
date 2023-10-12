import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";
import { URLMOVIE } from "../../constant/constant";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    fetch(`${URLMOVIE}/movies/movie/${id}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => console.error(error));
  }, [id]);

  useEffect(() => {
    fetch(`${URLMOVIE}/review/${id}/reviews`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error(error));
  }, [id]);

  const submitReview = () => {
    if (localStorage.getItem("access_token") != null) {
      fetch(`${URLMOVIE}/review/${id}/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: newReview,
      })
        .then((response) => response.json())
        .then((data) => {
          setNewReview("");
        })
        .catch((error) => console.error(error));
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
          {reviews.map((review) => (
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
          ></textarea>
          <button onClick={submitReview}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
