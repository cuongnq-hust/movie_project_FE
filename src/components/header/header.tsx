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

const Header = () => {
  const dispatch = useDispatch();

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
  const [userName, setUserName] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [showRegisterForm, setShowRegisterForm] = useState(false);
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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" style={{ color: "gold" }}>
          {/*           <FontAwesomeIcon icon={faVideoSlash} />
           */}{" "}
          Gold
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/watchList">
              Watch List
            </NavLink>
          </Nav>
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
              <Modal show={showRegisterForm} onHide={handleCloseRegisterForm}>
                <Modal.Header closeButton>
                  <Modal.Title>Đăng Ký</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <div>
                      <label>User name:</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={handleUsernameChange}
                      />
                    </div>
                    <div>
                      <label>Email:</label>
                      <input
                        type="email"
                        value={emailRegister}
                        onChange={handleEmailRegister}
                      />
                    </div>
                    <div>
                      <label>Mobile Number</label>
                      <input
                        type="text"
                        value={mobileNumber}
                        onChange={handleMobileNumber}
                      />
                    </div>
                    <div>
                      <label>Mật khẩu:</label>
                      <input
                        type="password"
                        value={passwordRegister}
                        onChange={handlePasswordRegister}
                      />
                    </div>
                    <Button
                      onClick={handleRegister}
                      variant="primary"
                      type="submit"
                    >
                      Đăng Ký
                    </Button>
                  </div>
                </Modal.Body>
              </Modal>
            </>
          )}

          <Modal show={showLoginForm} onHide={handleCloseLoginForm}>
            <Modal.Header closeButton>
              <Modal.Title>Đăng nhập</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <label>Mật khẩu:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <Button onClick={handleLogin} variant="primary" type="submit">
                  Đăng nhập
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
