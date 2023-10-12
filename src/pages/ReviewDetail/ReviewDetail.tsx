import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ReviewDetail.scss";
import { URL_BE } from "../../constant/constant";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const ReviewDetail = ({ reviewItem, email }: any) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const reviewId = urlParams.get("id") || "";
  const [comments, setComment] = useState<any>([]);
  const getCommentByReview = async () => {
    try {
      const response = await api.get(
        `${URL_BE}/comment/findByReviewId/${reviewId}`,
        {
          headers: authHeader(),
        }
      );
      if (response?.data) {
        setComment(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCommentByReview();
  }, []);
  const [commentForReview, setNewComment] = useState<any>("");
  const submitComment = async () => {
    if (localStorage.getItem("access_token") != null) {
      try {
        const response = await api.post(
          `${URL_BE}/comment/${reviewId}`,
          commentForReview.trim(),
          {
            headers: authHeader(),
          }
        );
        if (response?.data) {
          setNewComment("");
          getCommentByReview();
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Ban can Dang nhap de them binh luan");
    }
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
  const [aceptTitle, setAceptTitle] = useState<any>(reviewItem?.title);
  const [aceptImage, setAceptImage] = useState<any>(reviewItem?.image);
  const updateNew = () => {
    const data = {
      title: aceptTitle,
      image: aceptImage,
    };

    api
      .post(`${URL_BE}/new/update/${reviewId}`, data, {
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
      .post(`${URL_BE}/new/delete/${reviewId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((data) => {})
      .catch((error) => console.error(error));
  };
  const [newImageItem, setNewImageItem] = useState<any>("");
  return (
    <div>
      <p className="Hero__NewItem__newItemTitle">{reviewItem?.body}</p>
      <img className="Hero__NewItem__newItemImage" src={newImageItem} />
      {comments.map((commentItem: any) => {
        return (
          <div className="Hero__NewItem__commentItem">{commentItem.body}</div>
        );
      })}

      <div className="comment_form">
        <h2>Thêm Bình Luận</h2>
        <textarea
          value={commentForReview}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment..."
        ></textarea>
        <button onClick={submitComment}>Submit</button>
      </div>

      {email === reviewItem?.user.user_id ? (
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

export default ReviewDetail;
