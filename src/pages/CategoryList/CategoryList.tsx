import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CategoryList.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";

const CategoryList = () => {
  const dispatch = useDispatch();

  const [movie, setMovie] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [newReview, setNewReview] = useState<any>("");
  const getMovieByCategoryId = async (id: any) => {
    try {
      const response = await api.get(`${URL_BE}/movie/findByCategoryId/${id}`, {
        headers: authHeader(),
      });
      if (response?.data) setMovie(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCategoryAll = async () => {
    try {
      const response = await api.get(`${URL_BE}/category/all`, {
        headers: authHeader(),
      });
      if (response?.data) setCategories(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // getMovieById();
    getCategoryAll();
  }, []);

  // useEffect(() => {
  //   fetch(`${URL_BE}/review/${id}/reviews`)
  //     .then((response) => response.json())
  //     .then((data) => setCategories(data))
  //     .catch((error) => console.error(error));
  // }, [id]);

  const submitReview = async () => {
    // if (localStorage.getItem("access_token") != null) {
    //   try {
    //     const response = await api.post(
    //       `${URL_BE}/review/${id}`,
    //       newReview.trim(),
    //       {
    //         headers: authHeader(),
    //       }
    //     );
    //     if (response?.data) {
    //       getReviewByMovie();
    //       setNewReview("");
    //       dispatch(
    //         openToast({
    //           isOpen: Date.now(),
    //           content: "A Review Has been Created !",
    //           step: 1,
    //         })
    //       );
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // } else {
    //   alert("Ban can Dang nhap de them binh luan");
    // }
  };
  const navigate = useNavigate();

  return (
    <div className="grid-container">
      <div className="movie-details">
        <Button
          onClick={() => {
            navigate("/category-create");
          }}
        >
          Create Category
        </Button>

        {categories.map((cate: any, index: any) => {
          return (
            <div
              key={index}
              onClick={() => {
                getMovieByCategoryId(cate?.id);
              }}
              className="movie__title"
            >
              name: {cate?.title}
            </div>
          );
        })}
      </div>
      <div className="review-list">
        <div>
          <h1>Movie List</h1>
          <div className="review__list">
            {movie.map((review: any, index: any) => (
              <div className="movie-details" key={index}>
                <div className="movie__title">name: {review?.title}</div>
                <img
                  className="movie__poster"
                  src={review?.poster}
                  alt="poster"
                />
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

export default CategoryList;
