import { useEffect, useState } from "react";
import "./Profile.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { RE_NUMBER, URL_BE, sizeMax } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useSelector } from "react-redux";
import { getUserInfo } from "../../store/selector/RootSelector";
const Profile = () => {
  const dispatch = useDispatch();

  const userInfo = useSelector(getUserInfo);
  const [emailRegister, setEmailRegister] = useState<any>(userInfo?.email);
  const [userName, setUserName] = useState<any>(userInfo?.user_name);
  const [mobileNumber, setMobileNumber] = useState<any>(
    userInfo?.mobile_number
  );
  const [image, setimage] = useState<any>(userInfo?.image);

  useEffect(() => {
    setEmailRegister(userInfo?.email);
    setUserName(userInfo?.user_name);
    setMobileNumber(userInfo?.mobile_number);
    setimage(userInfo?.image);
  }, [userInfo]);

  const handleRegister = async () => {
    if (userName && mobileNumber && image)
      try {
        const response = await api.post(
          `${URL_BE}/auth/update`,
          {
            user_name: userName.trim(),
            mobile_number: Number(mobileNumber),
            image: image,
          },
          {
            headers: authHeader(),
          }
        );
        if (response?.status === 200) {
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "Update Profile Has Been Success !",
              step: 1,
            })
          );
        } else {
          dispatch(
            openToast({
              isOpen: Date.now(),
              content: "Update Profile Has Been Failed !",
              step: 2,
            })
          );
        }
      } catch (err) {
        console.log(err);
      }
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    let sizeImg = file ? Number(file?.size) : sizeMax + 1;
    if (sizeImg <= sizeMax) {
      let formData = new FormData();
      const fileName = Date.now() + file.name;
      formData.append("name", fileName);
      formData.append("file", file);
      try {
        const res: any = await api.post(
          `http://localhost:5000/api/upload?folder=products`,
          formData,
          {
            headers: {
              ...authHeader(),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        let data = res?.data;
        setimage(data?.url);
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };
  return (
    <div className="grid-container">
      <div className="movie-details"></div>
      <div className="review-list">
        <div className="review-form">
          <div className="movie__title">register</div>

          <InputGroup className="mt20px">
            <Form.Control
              readOnly
              aria-label="With textarea"
              value={emailRegister}
              onChange={(e) => setEmailRegister(e.target.value)}
              placeholder="Enter your Email..."
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                }
              }}
            />
          </InputGroup>

          <InputGroup className="mt20px">
            <Form.Control
              aria-label="With textarea"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
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
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => {
                let amount = e.target.value;

                if (!amount || amount.match(RE_NUMBER)) {
                  setMobileNumber(amount);
                }
              }}
              placeholder="Enter your Mobile..."
              onKeyDown={(event) => {
                if (event.code === "Enter") {
                }
              }}
            />
          </InputGroup>

          <div className=" mt30px">
            <label className="btn btn-primary " htmlFor="icon-button-file">
              Upload Avatar
            </label>
          </div>
          <div className="none">
            <form id="form" encType="multipart/form-data">
              <input
                accept="image/jpg, image/png"
                id="icon-button-file"
                type="file"
                onChange={(e) => {
                  uploadImage(e);
                }}
              />
            </form>
          </div>
          {image && (
            <img className=" mt30px register__ava" src={image} alt="poster" />
          )}
          <div className="df">
            <Button
              variant="warning"
              className="mt20px"
              onClick={handleRegister}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
