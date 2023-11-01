import { useSelector } from 'react-redux';
import axios from 'axios';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { Route, useNavigate } from 'react-router-dom';
import Routes from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import 'tailwindcss/tailwind.css';
import FirebaseRegister from 'views/pages/authentication/auth-forms/AuthRegister';
import CartManager from 'Helpers/CartManager';

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  axios.defaults.baseURL = 'http://localhost:4469';
  axios.defaults.withCredentials = true;
  
  const navigate = useNavigate();

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        if (window.location.pathname !== '/register') {
          console.log('Redirecting to login');
          navigate('/login');
        }
      }

    
      return Promise.reject(error);
    }
    );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <CartManager>
          <NavigationScroll>
            <Routes>
              <Route path="/register" component={FirebaseRegister} />
              <Route path="/login" component={FirebaseRegister} />
            </Routes>
          </NavigationScroll>
        </CartManager>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
