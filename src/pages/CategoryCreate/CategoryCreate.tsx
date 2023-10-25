import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CategoryCreate.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { ROLE_ADMIN, URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";

const CategoryCreate = () => {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState<any>([]);
  const [cate, setCate] = useState<any>("");

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
    getCategoryAll();
  }, []);

  const submitCategory = async () => {
    if (localStorage.getItem("access_token") != null) {
      try {
        const response = await api.post(
          `${URL_BE}/category/new`,
          {
            title: cate.trim(),
          },
          {
            headers: authHeader(),
          }
        );
        if (response?.data) {
          setCate("");
          getCategoryAll();

          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "A Category Has been Created !",
              step: 1,
            })
          );
        }
      } catch (err) {
        console.log(err);

        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Category Has been Failed !",
            step: 2,
          })
        );
      }
    } else {
      alert("Ban can Dang nhap de them binh luan");
    }
  };
  const navigate = useNavigate();
  const userInfo = useSelector(getUserInfo);

  return (
    <div className="grid-container">
      <div className="movie-details">
        {categories.map((cate: any, index: any) => {
          return (
            <CategoryDetail
              key={index}
              cate={cate}
              getCategoryAll={getCategoryAll}
            ></CategoryDetail>
          );
        })}
      </div>
      <div className="review-list">
        {userInfo?.role === ROLE_ADMIN && (
          <div className="review-form">
            <textarea
              value={cate}
              onChange={(e) => setCate(e.target.value)}
              placeholder="Enter category..."
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  submitCategory();
                }
              }}
            ></textarea>
            <Button onClick={submitCategory}>Create Category</Button>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryDetail = ({ cate, getCategoryAll }: any) => {
  const dispatch = useDispatch();
  const [showUpdateCom, setshowUpdateCom] = useState<any>(false);
  const [newCate, setnewCate] = useState<any>(cate?.title);

  const updateCategory = async (id: any) => {
    try {
      const response = await api.post(
        `${URL_BE}/category/update/${id}`,
        {
          title: newCate.trim(),
        },
        {
          headers: authHeader(),
        }
      );
      if (response?.status === 201) {
        getCategoryAll();
        setshowUpdateCom(false);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Category Has been Updated !",
            step: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(
        openToast({
          isOpen: Date.now(),
          content: "A Category Has been Failed !",
          step: 2,
        })
      );
    }
  };
  return (
    <div className="Hero__NewItem__commentItem">
      <Modal
        show={showUpdateCom}
        onHide={() => {
          setshowUpdateCom(false);
        }}
      >
        <Modal.Body>
          <div>
            <div>
              <label>Category: </label>
              <div>{cate?.title}</div>
            </div>
            <div>
              <label>New Category:</label>
              <div>
                <textarea
                  autoFocus
                  rows={4}
                  value={newCate}
                  onChange={(e) => {
                    setnewCate(e.target.value);
                  }}
                  placeholder="Enter your category..."
                  onKeyDown={(event) => {
                    if (event.code === "Enter") {
                      updateCategory(cate?.id);
                    }
                  }}
                ></textarea>
              </div>
            </div>
            <Button
              onClick={() => {
                updateCategory(cate?.id);
              }}
              variant="warning"
              type="submit"
            >
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="movie__title">
        {cate?.title}
        <Button
          variant="warning"
          onClick={() => {
            setshowUpdateCom(!showUpdateCom);
          }}
        >
          Update Category
        </Button>
      </div>
    </div>
  );
};

export default CategoryCreate;
