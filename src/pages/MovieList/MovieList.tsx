import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MovieList.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { RE_NUMBER, URL_BE, sizeMax } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { formatMoney } from "../../utils/commonFunction";

const MovieList = () => {
  const dispatch = useDispatch();

  const [cartId, setcartId] = useState<any>("");
  const [movies, setMovies] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [title, settitle] = useState<any>("");
  const [trailerLink, settrailerLink] = useState<any>("");
  const [poster, setposter] = useState<any>("");
  const [avatar, setavatar] = useState<any>("");
  const [cateId, setCateId] = useState<any>("");
  const [price, setprice] = useState<any>(0);

  const reset = () => {
    setprice(0);
    setavatar("");
    setposter("");
    settrailerLink("");
    settitle("");
  };
  const getMovieAll = async () => {
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
  const getCartNow = async () => {
    try {
      const response = await api.get(`${URL_BE}/cart/cartNow`, {
        headers: authHeader(),
      });
      if (response?.data) {
        setcartId(response?.data?.id);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const onAddToCart = async (id: any) => {
    try {
      const response = await api.post(
        `${URL_BE}/cart/new`,
        {
          movieId: id,
          quantity: 4,
        },
        {
          headers: authHeader(),
        }
      );
      if (response?.data) {
        setcartId(response?.data?.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategoryAll();
    getMovieAll();
    getCartNow();
  }, []);

  const getCategoryAll = async () => {
    try {
      const response = await api.get(`${URL_BE}/category/all`, {
        headers: authHeader(),
      });
      if (response?.data) {
        setCategories(response?.data);
        if (response?.data.length > 0) {
          setCateId(response?.data[0]?.id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onCreateMovie = async () => {
    if (localStorage.getItem("access_token") != null) {
      try {
        const response = await api.post(
          `${URL_BE}/movie/new`,
          {
            title: title.trim(),
            trailerLink: trailerLink.trim(),
            poster: poster,
            avatar: avatar,
            category_id: Number(cateId),
            price: Number(price),
          },
          {
            headers: authHeader(),
          }
        );
        if (response?.data) {
          reset();
          getMovieAll();

          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "A Movie Has been Created !",
              step: 1,
            })
          );
        }
      } catch (err) {
        console.log(err);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Movie Has been Failed !",
            step: 2,
          })
        );
      }
    } else {
      alert("Ban can Dang nhap de them binh luan");
    }
  };
  const navigate = useNavigate();

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    let sizeImg = file ? Number(file?.size) : sizeMax + 1;
    if (sizeImg <= sizeMax) {
      let formData = new FormData();
      const fileName = Date.now() + file.name;
      formData.append("name", fileName);
      formData.append("file", file);
      try {
        const res: any = await api.post(
          `http://localhost:5000/api/upload?folder=products`,
          formData,
          {
            headers: {
              ...authHeader(),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        let data = res?.data;
        setavatar(data?.url);
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };
  const uploadImage1 = async (e: any) => {
    const file = e.target.files[0];
    let sizeImg = file ? Number(file?.size) : sizeMax + 1;
    if (sizeImg <= sizeMax) {
      let formData = new FormData();
      const fileName = Date.now() + file.name;
      formData.append("name", fileName);
      formData.append("file", file);
      try {
        const res: any = await api.post(
          `http://localhost:5000/api/upload?folder=products`,
          formData,
          {
            headers: {
              ...authHeader(),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        let data = res?.data;
        setposter(data?.url);
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

  return (
    <div className="grid-container">
      <div className="movie-details">
        {movies.map((mov: any, index: any) => {
          return (
            <div key={index}>
              <div
                className="movie__title underline"
                onClick={() => {
                  navigate(`/category-list?id=${mov?.categoryMovie?.id}`);
                }}
              >
                category: {mov?.categoryMovie?.title}
              </div>
              <div className="df">
                <div className="movie__title">name: {mov?.title}</div>
                <Button
                  onClick={() => {
                    navigate(`/movie/${mov?.id}`);
                  }}
                >
                  Detail
                </Button>
              </div>
              <div className="df mt10px">
                <div className="movie__title">price: {formatMoney(mov?.price)} đ</div>
                <Button
                  variant="dark"
                  onClick={() => {
                    onAddToCart(mov?.id);
                  }}
                >
                  BUY
                </Button>
              </div>
              <img
                className="movie__poster mt10px"
                src={mov?.poster}
                alt="poster"
              />
            </div>
          );
        })}
      </div>
      <div className="review-list">
        <div className="review-form">
          <Form.Group controlId="formBasicSelect">
            <Form.Label>Select Category Type</Form.Label>
            <Form.Control
              as="select"
              value={cateId}
              onChange={(e) => {
                setCateId(e.target.value);
              }}
            >
              {categories.map((cate: any, index: any) => {
                return (
                  <option key={index} value={cate?.id}>
                    {cate?.title}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <div className=" mt30px">
            <label className="btn btn-primary " htmlFor="icon-button-file">
              Upload Avatar
            </label>
          </div>
          <div className="none">
            <form id="form" encType="multipart/form-data">
              <input
                accept="image/jpg, image/png"
                id="icon-button-file"
                type="file"
                onChange={(e) => {
                  uploadImage(e);
                }}
              />
            </form>
          </div>
          {avatar && (
            <img className=" mt30px movie__poster" src={avatar} alt="poster" />
          )}

          <div className=" mt30px">
            <label className="btn btn-primary " htmlFor="icon-button-file1">
              Upload Poster
            </label>
          </div>
          <div className="none">
            <form id="form" encType="multipart/form-data">
              <input
                accept="image/jpg, image/png"
                id="icon-button-file1"
                type="file"
                onChange={(e) => {
                  uploadImage1(e);
                }}
              />
            </form>
          </div>
          {poster && (
            <img className=" mt30px movie__poster" src={poster} alt="poster" />
          )}
        </div>
        <div className="review-form">
          <InputGroup className="mb-3">
            <Form.Control
              value={trailerLink}
              onChange={(e) => settrailerLink(e.target.value)}
              placeholder="Enter your trailerLink..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
          </InputGroup>

          <InputGroup>
            <Form.Control
              as="textarea"
              aria-label="With textarea"
              value={title}
              onChange={(e) => settitle(e.target.value)}
              placeholder="Enter your title..."
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                }
              }}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              maxLength={10}
              value={formatMoney(price)}
              onChange={(e) => {
                let amount = e.target.value;
                amount = amount.replaceAll(",", "");

                if (!amount || amount.match(RE_NUMBER)) {
                  setprice(amount);
                }
              }}
              placeholder="Enter your price..."
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
          </InputGroup>

          <Button onClick={onCreateMovie}>Create Movie</Button>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
