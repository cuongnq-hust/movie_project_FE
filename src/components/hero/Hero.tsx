import "./Hero.scss";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { URL_BE } from "../../constant/constant";
import React, { useEffect, useState } from "react";
import { authHeader } from "../../auth";
import api from "../api/axiosConfig";
import Modal from "react-bootstrap/Modal";

const Hero = () => {
  const [email, setEmail] = useState<any>("");
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

  const getUser = async () => {
    try {
      const response = await api.get(`${URL_BE}/auth/user`, {
        headers: authHeader(),
      });
      if (response?.data) setEmail(response?.data?.user_id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // getUser();
  }, []);

  const navigate = useNavigate();
  const [news, setNews] = useState<any>([]);
  function reviews(movieId: any) {
    navigate(`/movie/${movieId}`);
  }
  useEffect(() => {
    const getReviewByMovie = async () => {
      try {
        const response = await api.get(
          `${URL_BE}/review/findReviewByMovieId/${1}`,
          {
            headers: authHeader(),
          }
        );
        if (response?.data) setNews(response?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getReviewByMovie();
  }, []);
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

  return (
    <div className="movie-carousel-container">
      <Carousel>
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
                          onClick={() => reviews(movie.id)}
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

      {localStorage.getItem("access_token") ? (
        <div>
          <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={handleTitleChange} />
            <input type="file" onChange={handleImageChange} />
            <button type="submit">Submit</button>
          </form>

          {news.map((newitem: any, index: any) => (
            <NewItem key={index} email={email} newitem={newitem}></NewItem>
          ))}
        </div>
      ) : (
        <h1>Ban Can Dang Nhap</h1>
      )}
    </div>
  );
};

export default Hero;

const NewItem = ({ newitem, email }: any) => {
  const [comment, setComment] = useState<any>([]);
  // const getComment = async () => {
  //   try {
  //     const response = await api.get(`/api/v1/comment/list/${newitem?.id}`, {
  //       headers: authHeader(),
  //     });
  //     setComment(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  useEffect(() => {
    getImage();
    // getComment();
  }, []);
  const [newComment, setNewComment] = useState<any>("");
  const submitComment = async () => {
    if (localStorage.getItem("access_token") != null) {
      try {
        const response = await api.post(
          `http://localhost:8080/api/v1/comment/2`,
          newComment.trim(),
          {
            headers: authHeader(),
          }
        );
        if (response?.data) {
          setNewComment("");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Ban can Dang nhap de them binh luan");
    }

    // fetch(`${URL_BE}/comment/${newitem?.id}`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    //   },
    //   body: newComment,
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setNewComment("");
    //   })
    //   .catch((error) => console.error(error));
  };
  const [formUpdate, setFormUpdate] = useState<any>(false);
  const hideFormUpdate = () => {
    setFormUpdate(false);
  };
  const showFormUpdate = () => {
    setFormUpdate(true);
  };
  const handleTitleChange = (event: any) => {
    setAceptTitle(event.target.value);
  };
  const handleImageChange = (event: any) => {
    setAceptImage(event.target.value);
  };
  const [aceptTitle, setAceptTitle] = useState<any>(newitem?.title);
  const [aceptImage, setAceptImage] = useState<any>(newitem?.image);
  const updateNew = () => {
    const data = {
      title: aceptTitle,
      image: aceptImage,
    };

    api
      .post(`${URL_BE}/new/update/${newitem?.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((data) => {
        hideFormUpdate();
      })
      .catch((error) => console.error(error));
  };
  const deleteNew = () => {
    const data = "";
    api
      .post(`${URL_BE}/new/delete/${newitem?.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((data) => {})
      .catch((error) => console.error(error));
  };
  const [newImageItem, setNewImageItem] = useState<any>("");

  const getImage = async () => {
    try {
      const response = await api.get(
        `http://localhost:8080/${newitem?.image}`,
        {
          headers: authHeader(),
        }
      );
      if (response?.data) {
        console.log(response);
        const base64ImageData = `data:image/png;base64,${btoa(response?.data)}`;
        setNewImageItem(base64ImageData);
        console.log(newImageItem);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <p className="Hero__NewItem__newItemTitle">{newitem?.body}</p>
      <img className="Hero__NewItem__newItemImage" src={newImageItem} />
      {comment.map((commentItem: any) => {
        return (
          <div className="Hero__NewItem__commentItem">{commentItem.body}</div>
        );
      })}

      <div className="comment_form">
        <h2>Thêm Bình Luận</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment..."
        ></textarea>
        <button onClick={submitComment}>Submit</button>
      </div>

      {email === newitem?.user.user_id ? (
        <>
          <Button onClick={showFormUpdate}>Sửa</Button>
          <Button onClick={deleteNew} type="submit">
            Xóa bài viết
          </Button>
          <Modal show={formUpdate} onHide={hideFormUpdate}>
            <Modal.Body>
              <div>
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={aceptTitle}
                    onChange={handleTitleChange}
                  />
                </div>
                <div>
                  <label>content:</label>
                  <input
                    type="text"
                    value={aceptImage}
                    onChange={handleImageChange}
                  />
                </div>
                <Button onClick={updateNew} variant="primary" type="submit">
                  Update
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </>
      ) : null}
    </div>
  );
};
