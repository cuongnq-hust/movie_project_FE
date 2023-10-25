import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Cart.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";
import { RE_NUMBER, URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import { formatMoney } from "../../utils/commonFunction";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

const Cart = () => {
  const [cartItems, setcartItems] = useState<any>([]);
  const [cartId, setcartId] = useState<any>("");

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
  const getListCartItem = async (cartId: any) => {
    try {
      const response = await api.get(`${URL_BE}/cart/listCartItem/${cartId}`, {
        headers: authHeader(),
      });
      if (response?.data) {
        setcartItems(response?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getCartNow();
  }, []);
  useEffect(() => {
    if (cartId) getListCartItem(cartId);
  }, [cartId]);

  const createOrder = async () => {
    try {
      const response = await api.post(
        `${URL_BE}/cart/createOrder`,
        {},
        {
          headers: authHeader(),
        }
      );
      if (response?.data) {
        console.log(response);
        // setcartItems(response?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="layout">
      <div className="Hero__NewItem__commentList">
        {cartItems.map((itemCart: any, index: number) => {
          return (
            <ItemCartDetail key={index} itemCart={itemCart}></ItemCartDetail>
          );
        })}
      </div>

      <div className="comment_form">
        <Button onClick={createOrder}>Check to Order</Button>
      </div>
    </div>
  );
};

const ItemCartDetail = ({ itemCart, getCommentByReview }: any) => {
  const dispatch = useDispatch();
  const [movie, setMovie] = useState<any>({});
  const [quantity, setquantity] = useState<any>(itemCart?.quantity);
  useEffect(() => {
    getMovieById();
  }, []);
  const getMovieById = async () => {
    try {
      const response = await api.get(`${URL_BE}/movie/${itemCart?.movieId}`, {
        headers: authHeader(),
      });
      if (response?.data) setMovie(response?.data);
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
          quantity: Number(quantity),
        },
        {
          headers: authHeader(),
        }
      );
      if (response?.data) {
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A movie Has been change quantity to card Success !",
            step: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const removeItemCart = async (id: any) => {
    try {
      const response = await api.post(`${URL_BE}/cart/deleteItem/${id}`, id, {
        headers: {
          "Content-Type": "text/plain",
          ...authHeader(),
        },
      });
      if (response?.status === 201) {
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
    <div className="Hero__NewItem__itemCart ml40px">
      {movie && (
        <div className="movie-details">
          <div className="movie__title">name: {movie?.title}</div>
          <div className="df mt10px">
            <div className="movie__title">
              price: {formatMoney(movie?.price)} $
            </div>
            <div className="df">
              <InputGroup className="mb-3">
                <Form.Control
                  maxLength={2}
                  value={quantity}
                  onChange={(e) => {
                    let amount = e.target.value;
                    if (!amount || amount.match(RE_NUMBER)) {
                      setquantity(amount);
                    }
                  }}
                  placeholder="Enter quantity..."
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    }
                  }}
                />
              </InputGroup>

              <div className="actions">
                <Button
                  variant="dark"
                  onClick={() => {
                    onAddToCart(movie?.id);
                  }}
                >
                  CHANGE QUANTITY
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    removeItemCart(movie?.id);
                  }}
                  type="submit"
                >
                  REMOVE ITEM
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
