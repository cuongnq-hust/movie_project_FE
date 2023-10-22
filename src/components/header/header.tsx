// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import api from "../api/axiosConfig";
import Modal from "react-bootstrap/Modal";
import React, { useEffect, useState } from "react";
import { authHeader } from "../../auth";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../store/storeComponent/auth/authSlice";
import { URL_BE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const arr = [
  {
    id: 1,
    navigate: "/category-list",
    label: "category",
  },
  {
    id: 2,
    navigate: "/movie-list",
    label: "movie",
  },
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [showLoginForm, setShowLoginForm] = useState<any>(false);
  const [email, setEmail] = useState<any>("");
  const [password, setPassword] = useState<any>("");

  const getUser = async () => {
    try {
      const response = await api.get(`${URL_BE}/auth/user`, {
        headers: authHeader(),
      });
      if (response?.data) {
        dispatch(setUserInfo({ ...response?.data }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };
  const handleLoginClick = () => {
    setShowLoginForm(true);
  };
  const handleCloseLoginForm = () => {
    setShowLoginForm(false);
  };
  const handleLogin = async () => {
    try {
      const response = await api.post(`${URL_BE}/auth/login`, {
        email: email,
        password: password,
      });
      if (response.data.statusCodeValue === 200) {
        localStorage.setItem("access_token", response.data.body.access_token);
        localStorage.setItem("username", email);
        handleCloseLoginForm();
      } else alert("Sai ten dang nhap hoac mat khau");
    } catch (err) {
      console.log(err);
    }
  };
  const access_token = localStorage.getItem("access_token");
  const usernamed = localStorage.getItem("username");
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    window.location.reload();
  };
  const [userName, setUserName] = useState<any>("");
  const [emailRegister, setEmailRegister] = useState<any>("");
  const [mobileNumber, setMobileNumber] = useState<any>("");
  const [passwordRegister, setPasswordRegister] = useState<any>("");
  const [image, setimage] = useState<any>("");
  const [showRegisterForm, setShowRegisterForm] = useState<any>(false);
  const handleUsernameChange = (event: any) => {
    setUserName(event.target.value);
  };
  const handleEmailRegister = (event: any) => {
    setEmailRegister(event.target.value);
  };
  const handleMobileNumber = (event: any) => {
    setMobileNumber(event.target.value);
  };
  const handlePasswordRegister = (event: any) => {
    setPasswordRegister(event.target.value);
  };
  const handleRegisterClick = () => {
    setShowRegisterForm(true);
  };
  const handleCloseRegisterForm = () => {
    setShowRegisterForm(false);
  };
  const handleRegister = async () => {
    try {
      const response = await api.post(`${URL_BE}/auth/register`, {
        user_name: userName,
        email: emailRegister,
        mobile_number: mobileNumber,
        password: passwordRegister,
        image: image,
      });
      if (response.data.statusCodeValue === 200) {
        handleCloseRegisterForm();
        alert("Ban da dang ky thanh cong");
      } else alert("Tai Khoan Da Ton Tai");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div id="menu">
      <Modal show={showLoginForm} onHide={handleCloseLoginForm}>
        <Modal.Header closeButton>
          <Modal.Title>Đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={handleEmailChange} />
            </div>
            <div>
              <label>Mật khẩu:</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <Button onClick={handleLogin} variant="warning" type="submit">
              Đăng nhập
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className="menu__item clothes__list--show">
        {access_token ? (
          <div>
            <a href="">Xin chao {usernamed}</a>
            <Button variant="outline-info" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline-info"
              className="me-2"
              onClick={handleLoginClick}
            >
              Đăng nhập
            </Button>
            <Button variant="outline-info" onClick={handleRegisterClick}>
              Đăng ký
            </Button>
          </>
        )}
      </div>
      {arr.map((it: any) => {
        return (
          <div
            key={it.id}
            onClick={() => {
              navigate(it.navigate);
            }}
            className={
              pathname.includes(it.label)
                ? "menu__item word__list--show choose"
                : "menu__item word__list--show"
            }
          >
            {it.label}
          </div>
        );
      })}

      {/* <div className="menu__item bizz__list--show">#zingchart</div> */}

      {/* <div className="menu__item watch__list--show">theo dõi</div> */}
    </div>
  );
};

export default Header;
