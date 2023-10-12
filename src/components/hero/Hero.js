import "./Hero.css";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { URLMOVIE } from "../../constant/constant";
import React, { useEffect, useState } from "react";
import { authHeader } from "../../auth";
import api from "../api/axiosConfig";
import Modal from "react-bootstrap/Modal";

const Hero = ({ movies }) => {
  const [email, setEmail] = useState("");
  const getUser = async () => {
    try {
      const response = await api.get(`${URLMOVIE}/auth/user`, {
        headers: authHeader(),
      });
      if (response?.data) setEmail(response?.data?.user_id);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  function reviews(movieId) {
    navigate(`/movies/movie/${movieId}`);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${URLMOVIE}/new/new`, {
          headers: authHeader(),
        });
        if (response && response.data) {
          setNews(response.data);
          // console.log("danh sach la: ", response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const [title, setTitle] = useState("");
  const [newImage, setNewImage] = useState(null);
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleImageChange = (event) => {
    setNewImage(event.target.files[0]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", newImage);

    try {
      const response = await api.post(`${URLMOVIE}/new/new`, formData, {
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
        {movies?.map((movie) => {
          return (
            <Paper key={movie.id}>
              <div className="movie-card-container">
                <div
                  className="movie-card"
                  style={{ "--img": `url(${movie.backdrops[0]})` }}
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
                          <FontAwesomeIcon
                            className="play-button-icon"
                            icon={faCirclePlay}
                          />
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

          {news.map((newitem, index) => (
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

const NewItem = ({ newitem, email }) => {
  const [comment, setComment] = useState([]);
  const getComment = async () => {
    try {
      const response = await api.get(`/api/v1/comment/list/${newitem?.id}`, {
        headers: authHeader(),
      });
      setComment(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getImage();
    getComment();
  }, []);
  const [newComment, setNewComment] = useState("");
  const submitComment = () => {
    fetch(`${URLMOVIE}/comment/newComment/${newitem?.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: newComment,
    })
      .then((response) => response.json())
      .then((data) => {
        setNewComment("");
      })
      .catch((error) => console.error(error));
  };
  const [formUpdate, setFormUpdate] = useState(false);
  const hideFormUpdate = () => {
    setFormUpdate(false);
  };
  const showFormUpdate = () => {
    setFormUpdate(true);
  };
  const handleTitleChange = (event) => {
    setAceptTitle(event.target.value);
  };
  const handleImageChange = (event) => {
    setAceptImage(event.target.value);
  };
  const [aceptTitle, setAceptTitle] = useState(newitem?.title);
  const [aceptImage, setAceptImage] = useState(newitem?.image);
  const updateNew = () => {
    const data = {
      title: aceptTitle,
      image: aceptImage,
    };

    api
      .post(`${URLMOVIE}/new/update/${newitem?.id}`, data, {
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
      .post(`${URLMOVIE}/new/delete/${newitem?.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((data) => {})
      .catch((error) => console.error(error));
  };
  const [newImageItem, setNewImageItem] = useState("");

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
      <p className="Hero__NewItem__newItemTitle">{newitem?.title}</p>
      <img className="Hero__NewItem__newItemImage" src={newImageItem} />
      {comment.map((commentItem) => {
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
