// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import api from "../api/axiosConfig";
import { useEffect, useState } from "react";
import { authHeader } from "../../auth";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../store/storeComponent/auth/authSlice";
import { URL_BE } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

const arr = [
  {
    id: 4,
    navigate: "/home",
    label: "home",
  },
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
  {
    id: 3,
    navigate: "/cart",
    label: "cart",
  },
  {
    id: 5,
    navigate: "/order-list",
    label: "order",
  },
];

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const [user, setuser] = useState<any>("");
  const [role, setrole] = useState<any>("");

  const getUserRole = async () => {
    try {
      const response = await api.get(`${URL_BE}/auth/roles`, {
        headers: authHeader(),
      });
      if (response?.data) {
        setrole(response.data[0]?.name);
        // dispatch(setUserInfo({ ...response?.data }));
        // setuser(response?.data?.user_name);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getUser = async () => {
    try {
      const response = await api.get(`${URL_BE}/auth/user`, {
        headers: authHeader(),
      });
      if (response?.data) {
        // console.log(response?.data);
        setuser(response?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
    getUserRole();
  }, []);

  useEffect(() => {
    dispatch(setUserInfo({ ...user, role }));
  }, [role, user]);

  const access_token = localStorage.getItem("access_token");
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    navigate("/login");
    // window.location.reload();
  };

  return (
    <div id="menu">
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
      <div className="menu__item clothes__list--show">
        {access_token ? (
          <div className="df">
            <div
              onClick={() => {
                navigate("/update-profile");
              }}
              className="underline"
            >
              Hi {user?.user_name}
            </div>
            <Button variant="danger" onClick={handleLogout}>
              Đăng xuất
            </Button>
          </div>
        ) : (
          <>
            <Button variant="warning" className="me-2" onClick={handleLogout}>
              Đăng nhập
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                navigate("/register");
              }}
            >
              Đăng ký
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
