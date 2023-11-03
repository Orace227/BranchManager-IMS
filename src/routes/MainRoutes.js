import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Categories from 'views/Products/Categories';
import Products from 'views/Products/Products';
import Cart from 'views/Cart/Cart';
import History from 'views/Orders/History';
import NotFound from '404Notfound/404page';
import PendingOrders from 'views/Orders/PendingOrders';
import OrderView from 'views/Orders/OrderView';
import AttendedOrders from 'views/Orders/AttendedOrders';
import Employees from 'views/Employee/Employees';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router';// import Navigate from "react-router-dom";
import SurveyOrderView from 'views/SurveyForm/SurveyOrderView';
import Survey from 'views/SurveyForm/Survey';
import SurveyForm from 'views/SurveyForm/CreateSurvey';
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Customers = Loadable(lazy(() => import('views/Products/Customers')));

const auth = Cookies.get('Authtoken');

function renderDashboardRoute() {
  if (auth) {
    return <DashboardDefault />;
  } else {
    return <Navigate to="/login" />;
  }
}
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: renderDashboardRoute()
    },
    {
      path: 'dashboard',
      element: renderDashboardRoute()
    },
    {
      path: '/Products',
      element: <Customers />
    },
    {
      path: '/Categories',
      element: <Categories />
    },
    {
      path: '/BuyProducts/:category',
      element: <Products />
    },
    {
      path: '/Cart',
      element: <Cart />
    },
    {
      path: '/OrderHistory',
      element: <History />
    },
    {
      path: '/PendingOrders',
      element: <PendingOrders />
    },
    {
      path: '/OrderView/:orderId',
      element: <OrderView />
    },
    {
      path: '/AttendedOrders',
      element: <AttendedOrders />
    },
    {
      path: '/Employees',
      element: <Employees />
    },
    {
      path: '/SurveyForm',
      element: <SurveyForm />
    },
    {
      path: '/SurveyHistory',
      element: <Survey />
    },
    {
      path: '/SurveyOverView/:surveyId',
      element: <SurveyOrderView />
    },

    {
      path: '*',
      element: <NotFound />
    }
  ]
};

export default MainRoutes;
