import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Cart.scss";
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

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cartId, setcartId] = useState<any>("");
  const userInfo = useSelector(getUserInfo);

  const [comments, setComments] = useState<any>([]);
  const [reviewItem, setreviewItem] = useState<any>({});

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
  useEffect(() => {
    getCartNow();
  }, []);

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
      <p className="Hero__NewItem__newItemTitle">{reviewItem?.body}</p>
      <div className="Hero__NewItem__commentList">
        {comments.map((commentItem: any, index: number) => {
          return (
            <CommentDetail
              key={index}
              commentItem={commentItem}
            ></CommentDetail>
          );
        })}
      </div>

      <div className="comment_form">
        <Button onClick={() => {}}>Check to Order</Button>
      </div>
      {userInfo?.email === reviewItem?.user?.user_id ? (
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
      ) : null}
    </div>
  );
};

const CommentDetail = ({ commentItem, getCommentByReview }: any) => {
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
    </div>
  );
};

export default Cart;