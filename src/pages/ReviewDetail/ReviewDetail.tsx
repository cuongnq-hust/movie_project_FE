import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ReviewDetail.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";
import { URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import Modal from "react-bootstrap/Modal";

const ReviewDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const reviewId = urlParams.get("id") ?? "";

  const userInfo = useSelector(getUserInfo);

  const [comments, setComments] = useState<any>([]);
  const [reviewItem, setreviewItem] = useState<any>({});

  const getReviewById = async () => {
    try {
      const response = await api.get(`${URL_BE}/review/review/${reviewId}`, {
        headers: authHeader(),
      });
      if (response?.data) {
        setreviewItem(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getCommentByReview = async () => {
    try {
      const response = await api.get(
        `${URL_BE}/comment/findByReviewId/${reviewId}`,
        {
          headers: authHeader(),
        }
      );
      if (response?.data) {
        setComments(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCommentByReview();
    getReviewById();
  }, []);
  const [commentForReview, setNewComment] = useState<any>("");
  const submitComment = async () => {
    if (localStorage.getItem("access_token") != null) {
      try {
        const response = await api.post(
          `${URL_BE}/comment/${reviewId}`,
          commentForReview.trim(),
          {
            headers: {
              "Content-Type": "text/plain",
              ...authHeader(),
            },
          }
        );
        if (response?.data) {
          setNewComment("");
          getCommentByReview();
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "A Comment Has been created !",
              step: 1,
            })
          );
        }
      } catch (err) {
        console.log(err);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Comment Has been Failed !",
            step: 2,
          })
        );
      }
    } else {
      alert("Ban can Dang nhap de them binh luan");
    }
  };

  const [showUpdateReview, setshowUpdateReview] = useState<any>(false);
  const [newReview, setnewReview] = useState<any>(reviewItem?.body);
  const updateReview = async (id: any) => {
    try {
      const response = await api.post(
        `${URL_BE}/review/update/${id}`,
        newReview.trim(),
        {
          headers: {
            "Content-Type": "text/plain",
            ...authHeader(),
          },
        }
      );
      if (response?.status === 201) {
        getReviewById();
        setshowUpdateReview(false);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Review Has been Updated !",
            step: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "A Comment Has been Failed !",
          step: 2,
        })
      );
    }
  };

  const deleteReview = async (id: any) => {
    try {
      const response = await api.post(`${URL_BE}/review/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response?.status === 200) {
        getReviewById();
        setshowUpdateReview(false);
        navigate(-1);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Review Has been Deleted !",
            step: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "A Comment Has been Failed !",
          step: 2,
        })
      );
    }
  };

  return (
    <div className="layout">
      <Modal
        show={showUpdateReview}
        onHide={() => {
          setshowUpdateReview(false);
        }}
      >
        <Modal.Body>
          <div>
            <div>
              <label>Review: </label>
              <div>{reviewItem?.body}</div>
            </div>
            <div>
              <label>New Review:</label>

              <div>
                <textarea
                  autoFocus
                  rows={4}
                  value={newReview}
                  onChange={(e) => {
                    setnewReview(e.target.value);
                  }}
                  placeholder="Enter your comment..."
                  onKeyDown={(event) => {
                    if (event.code === "Enter") {
                      updateReview(reviewItem?.id);
                    }
                  }}
                ></textarea>
              </div>
            </div>
            <Button
              onClick={() => {
                updateReview(reviewItem?.id);
              }}
              variant="warning"
              type="submit"
            >
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="movie-details">
        <div className="movie__title underline mb20px">
          category: {reviewItem?.movie?.categoryMovie?.title}
        </div>
        <div className="df">
          <div className="movie__title">name: {reviewItem?.movie?.title}</div>
          <Button
            onClick={() => {
              navigate(`/movie/${reviewItem?.movie?.id}`);
            }}
          >
            Detail
          </Button>
        </div>
        <img
          className="movie__poster mt10px"
          src={reviewItem?.movie?.poster}
          alt="poster"
        />
      </div>
      <div className="df mt30px">
        <p className="Hero__NewItem__newItemTitle">{reviewItem?.body}</p>
        {userInfo?.email === reviewItem?.user?.user_id && (
          <div className="actions">
            <Button
              variant="warning"
              onClick={() => {
                setshowUpdateReview(!showUpdateReview);
              }}
            >
              Update Review
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteReview(reviewItem?.id);
              }}
              type="submit"
            >
              Delete Review
            </Button>
          </div>
        )}
      </div>
      <div className="Hero__NewItem__commentList">
        {comments.map((commentItem: any, index: number) => {
          return (
            <CommentDetail
              key={index}
              commentItem={commentItem}
              userInfo={userInfo}
              getCommentByReview={getCommentByReview}
            ></CommentDetail>
          );
        })}
      </div>
      <div className="comment_form">
        <h2>Thêm Bình Luận</h2>
        <textarea
          value={commentForReview}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Enter your comment..."
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              submitComment();
            }
          }}
        ></textarea>
        <Button onClick={submitComment}>Submit</Button>
      </div>
    </div>
  );
};

const CommentDetail = ({ commentItem, getCommentByReview, userInfo }: any) => {
  const dispatch = useDispatch();
  const [showUpdateCom, setshowUpdateCom] = useState<any>(false);
  const [newCom, setnewCom] = useState<any>(commentItem?.body);

  const deleteComment = async (id: any) => {
    try {
      const response = await api.post(`${URL_BE}/comment/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response?.status === 200) {
        getCommentByReview();
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Comment Has been Deleted !",
            step: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "A Comment Has been Failed !",
          step: 2,
        })
      );
    }
  };

  const updateComment = async (id: any) => {
    try {
      const response = await api.post(
        `${URL_BE}/comment/update/${id}`,
        newCom.trim(),
        {
          headers: {
            "Content-Type": "text/plain",
            ...authHeader(),
          },
        }
      );
      if (response?.status === 201) {
        getCommentByReview();
        setshowUpdateCom(false);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Comment Has been Updated !",
            step: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "A Comment Has been Failed !",
          step: 2,
        })
      );
    }
  };
  // console.log(commentItem?.user?.email);
  // console.log(userInfo?.email);
  return (
    <div className="Hero__NewItem__commentItem ml40px">
      <Modal
        show={showUpdateCom}
        onHide={() => {
          setshowUpdateCom(false);
        }}
      >
        <Modal.Body>
          <div>
            <div>
              <label>Review: </label>
              <div>{commentItem?.review?.body}</div>
            </div>
            <div>
              <label>New Comment:</label>

              <div>
                <textarea
                  autoFocus
                  rows={4}
                  value={newCom}
                  onChange={(e) => {
                    setnewCom(e.target.value);
                  }}
                  placeholder="Enter your comment..."
                  onKeyDown={(event) => {
                    if (event.code === "Enter") {
                      updateComment(commentItem?.id);
                    }
                  }}
                ></textarea>
              </div>
            </div>
            <Button
              onClick={() => {
                updateComment(commentItem?.id);
              }}
              variant="warning"
              type="submit"
            >
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="title">{commentItem?.body}</div>

      {commentItem?.user?.email === userInfo?.email && (
        <div className="actions">
          <Button
            variant="warning"
            onClick={() => {
              setshowUpdateCom(!showUpdateCom);
            }}
          >
            Update Comment
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteComment(commentItem?.id);
            }}
            type="submit"
          >
            Delete Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewDetail;
