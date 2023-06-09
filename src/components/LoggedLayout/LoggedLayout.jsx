import React, { useState, useEffect, useContext } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { Container } from './styles';
import { useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb, Loading } from '../../components';
import UserContext from '../../context/UserContext';
import { api } from '../../services/api';

const LoggedLayout = ({ title, children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');

  document.title = `Portal do Proprietário | ${title}`;

  useEffect(() => {
    const fetchAlerts = () => {
      api
        .get(`/aviso`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .catch((err) => {
          if (err.message === 'Request failed with status code 401') {
            localStorage.removeItem('token');
            navigate('/');
          }
        });
    };
    token && fetchAlerts(token);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <>
      {state.loading && <Loading status={state.loading} />}

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />
      <Header logged onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
      <Container w={location.pathname === '/news' && '100%'}>
        <Breadcrumb items={state.breadcrumb} />
        {children}
      </Container>
    </>
  );
};

export default LoggedLayout;
