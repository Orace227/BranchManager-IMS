import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
// project imports
// import PopularCard from './PopularCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
// import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import TotalCanceledCard from './TotalCanceledCard';
import TotalPendingCard from './TotalPendingCard';
import TotalApprovedCard from './TotalApprovedCard';
import TotalAttendedCard from './TotalAttendedCard';
import TotalPendingReq from './TotalPendingReq';
import TotalApprovedReq from './TotalApprovedReq';
import PendingEmployees from './PendingEmployees';
import ApprovedEmployees from './ApprovedEmployees';
// ==============================|| DEFAULT DASHBOARD ||============================== //
const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const handleNotification = async () => {
    try {
      const GetCartId = await axios.get('/GetCartId');
      console.log(GetCartId.data.cartId);
      const cartId = GetCartId.data.cartId;
      const Notification = await axios.get(`/GetOrders?EmployeeNotification=true&cartId=${cartId}`, {
        withCredentials: true // Include credentials (cookies) with the request
      });
      console.log(Notification.data.existedOrders);
      const NotificationArr = Notification.data.existedOrders;
      NotificationArr.forEach((element) => {
        let Message = `Your Order has been ${element.Status} By ShopKeeper`;
        let receivedOrderId = element.orderId;
        if (element.Status === 'approved') {
          toast.success(Message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            onClick: () => {
              navigate(`/OrderHistory?receivedOrderId=${receivedOrderId}`);
            }
          });
        }
        if (element.Status === 'attended') {
          toast.warn(Message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            onClick: () => {
              navigate(`/attendedOrders?receivedOrderId=${receivedOrderId}`);
            }
          });
        }

        if (element.Status === 'canceled') {
          toast.error(Message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            onClick: () => {
              navigate(`/OrderHistory?receivedOrderId=${receivedOrderId}`);
            }
          });
        }
        element.EmployeeNotification = false;
        const offNotification = axios.post('/UpdateOrder', element, {
          withCredentials: true // Include credentials (cookies) with the request
        });
        if (offNotification) {
          console.log(offNotification);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setLoading(false);
    handleNotification();
  }, []);

  return (
    <>
      {/* <Toaster /> */}
      <ToastContainer />
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <TotalPendingCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <TotalCanceledCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <TotalApprovedCard isLoading={isLoading} />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <TotalAttendedCard isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={3} lg={3}>
              <Grid container spacing={gridSpacing}>
                <Grid item md={12} sm={6} xs={12}>
                  <TotalPendingReq isLoading={isLoading} />
                </Grid>
                <Grid item md={12} sm={6} xs={12}>
                  <TotalApprovedReq isLoading={isLoading} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={9}>
              <PendingEmployees isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <ApprovedEmployees isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
