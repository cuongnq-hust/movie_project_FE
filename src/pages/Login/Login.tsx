import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Login.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setuser] = useState<any>("");
  const [pass, setpass] = useState<any>("");
  const handleLogin = async () => {
    try {
      const response = await api.post(`${URL_BE}/auth/login`, {
        email: user.trim(),
        password: pass.trim(),
      });
      if (response?.data?.statusCodeValue === 200) {
        localStorage.setItem("access_token", response.data.body.access_token);
        localStorage.setItem("username", user.trim());
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "Login Success !",
            step: 1,
          })
        );
        navigate("/home");
      } else {
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "Wrong User or Password!",
            step: 2,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid-container">
      <div className="movie-details"></div>
      <div className="review-list">
        <div className="review-form">
          <div className="movie__title">login</div>
          <InputGroup className="mt20px">
            <Form.Control
              aria-label="With textarea"
              value={user}
              onChange={(e) => setuser(e.target.value)}
              placeholder="Enter your user..."
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                }
              }}
            />
          </InputGroup>
          <InputGroup className="mt20px">
            <Form.Control
              aria-label="With textarea"
              value={pass}
              onChange={(e) => setpass(e.target.value)}
              placeholder="Enter your password..."
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                  handleLogin();
                }
              }}
            />
          </InputGroup>
          <div className="df">
            <Button
              className="mt20px"
              variant="warning"
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </Button>
            <Button className="mt20px" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
