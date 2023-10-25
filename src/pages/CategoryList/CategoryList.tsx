import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CategoryList.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { ROLE_ADMIN, URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";

const CategoryList = () => {
  const userInfo = useSelector(getUserInfo);


  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const cateIdurl = urlParams.get("id") ?? "";

  const [movies, setMovies] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [cateId, setCateId] = useState<any>(cateIdurl);
  const getMovieByCategoryId = async (id: any) => {
    try {
      const response = await api.get(`${URL_BE}/movie/findByCategoryId/${id}`, {
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

  const getCategoryAll = async () => {
    try {
      const response = await api.get(`${URL_BE}/category/all`, {
        headers: authHeader(),
      });
      if (response?.data) {
        setCategories(response?.data);
        if (response?.data.length > 0) {
          if (cateIdurl) {
            setCateId(cateIdurl);
            getMovieByCategoryId(cateIdurl);
          } else {
            setCateId(response?.data[0]?.id);
            getMovieByCategoryId(response?.data[0]?.id);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // getMovieById();
    getCategoryAll();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="grid-container">
      <div className="movie-details">
        {userInfo?.role === ROLE_ADMIN && (
          <Button
            className="mb40px"
            onClick={() => {
              navigate("/category-create");
            }}
          >
            Create Category
          </Button>
        )}

        {categories.map((cate: any, index: any) => {
          return (
            <div
              key={index}
              onClick={() => {
                getMovieByCategoryId(cate?.id);
                setCateId(cate?.id);
              }}
              className={
                cateId.toString() === cate?.id.toString()
                  ? "movie__title choose"
                  : "movie__title"
              }
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
            {movies.map((review: any, index: any) => (
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
      </div>
    </div>
  );
};

export default CategoryList;
