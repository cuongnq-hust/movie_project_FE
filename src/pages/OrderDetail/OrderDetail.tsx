import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./OrderDetail.scss";
import { authHeader } from "../../auth";
import api from "../../components/api/axiosConfig";
import Button from "react-bootstrap/Button";
import { DATE_DOT, URL_BE } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { openToast } from "../../store/storeComponent/customDialog/toastSlice";
import { formatMoney } from "../../utils/commonFunction";
import moment from "moment";
import { PayPalButton } from "react-paypal-button-v2";
import Icons from "./../../asset/circle.svg";

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [order, setorder] = useState<any>({});
  const [cartItems, setcartItems] = useState<any>([]);
  const [total, settotal] = useState<any>(0);
  const [sdkReady, setSdkReady] = useState<any>(false);

  const successPaymentHandler = (paymentResult: any) => {
    console.log(paymentResult);
    onPayOrder(order?.id);
  };

  useEffect(() => {
    if (1) {
      const addPayPalScript = async () => {
        const clientId =
          "AetgEg127o-2z1ix-1gFlUc1xTstejtxpOz5e6o-qahfHA-Mxl7ErUWKOFCYjGZFjpQkKZAUUz2bYGD1";
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true);
        };
        document.body.appendChild(script);
      };
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, []);

  const getOrderById = async (orderId: any) => {
    try {
      const response = await api.get(`${URL_BE}/cart/orderDetail/${orderId}`, {
        headers: authHeader(),
      });
      if (response?.data) {
        setorder(response?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getCartById = async (cartId: any) => {
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
  const onPayOrder = async (orderId: any) => {
    try {
      const response = await api.post(
        `${URL_BE}/cart/payOrder/${orderId}`,
        {},
        {
          headers: authHeader(),
        }
      );
      if (response?.status === 200) {
        getOrderById(id);
        dispatch(
          openToast({
            isOpen: Date.now(),
            content: "A Order Has Pay Success !",
            step: 1,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrderById(id);
  }, []);
  useEffect(() => {
    if (order?.id) getCartById(order?.cartId);
  }, [order]);

  useEffect(() => {
    if (cartItems.length > 0) {
      let total_tem = 0;
      cartItems.map((item: any, index: number) => {
        total_tem = total_tem + +(item?.price * item?.quantity);
      });
      settotal(total_tem);
    }
  }, [cartItems]);

  return (
    <div className="layout">
      <div className="Hero__NewItem__commentList">
        <div className="df mt10px">
          <div className="movie__title">
            {moment(order?.create_At).format(DATE_DOT)}
          </div>
          <div className="movie__title">total: {formatMoney(total)} $</div>

          <div className="df">
            <div className="actions">
              {order?.pay ? (
                <>
                  <Button variant="dark" onClick={() => {}}>
                    IS PAY AT
                  </Button>
                </>
              ) : (
                <Button variant="danger" onClick={() => {}}>
                  NOT PAY
                </Button>
              )}

              {!order?.pay ? (
                !sdkReady ? (
                  <div className="play-button-icon-container">
                    <div className="play-button-icon">
                      <img src={Icons} alt="Icons" />
                    </div>
                  </div>
                ) : (
                  <PayPalButton
                    amount={total}
                    onSuccess={successPaymentHandler}
                  />
                )
              ) : (
                <div className="none1">
                  <div className="movie__title">
                    {moment(order?.update_At).format(DATE_DOT)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderItem = ({ order, getOrderList }: any) => {
  return <div className="Hero__NewItem__itemCart ml40px"></div>;
};

export default OrderDetail;
