import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PasswordReset from './pages/PasswordReset';
import LoginPage from './pages/LoginPage';
import { GlobalStyle } from './styles';
import UserContext, { UserContextProvider } from './context/UserContext';
import { LoggedLayout } from './components';
import { Layout } from './components';
import './index.css';
import Documents from './pages/Documents';
import Statement from './pages/Statement/Statement';
import GenerateBill from './pages/GenerateBill';
import ForgotPassword from './pages/ForgotPassword';
import MidLevelPage from './pages/MidLevelPage';

import billImg from './assets/bill.svg';
import docCond from './assets/village-svgrepo-com.svg';
import newsIcon from './assets/news-icon.svg';
import docLoc from './assets/Azul_Vertical.png';
import docImage from './assets/documents.svg';
import statementImg from './assets/statement.svg';
import { useEffect } from 'react';
import News from './pages/News';
import DependantRegistration from './pages/DependantRegistration';

function App() {
  const { state, setState } = useContext(UserContext);
  const novaSenha = localStorage.getItem('novaSenha');
  const isAdmin = localStorage.getItem('flg_admin');

  useEffect(() => {
    setState({ nova_senha: novaSenha, flg_admin: isAdmin });
  }, [state]);

  const midLevelItems = [
    {
      id: 'home',
      items: [
        { src: docCond, link: '/cond', text: 'Condomínio' },
        { src: docLoc, link: '/loc', text: 'Pool' },
        { src: newsIcon, link: '/news', text: 'Acontece no Costão' }
      ]
    },
    {
      id: 'cond',
      items: [
        {
          src: billImg,
          link: '/generate-bill',
          text: 'Emitir 2ª via de boleto'
        },
        { src: docImage, link: '/cond-docs', text: 'Documentos' }
      ]
    },
    {
      id: 'loc',
      items: [
        { src: statementImg, link: '/statement', text: 'Extrato de locação' },
        { src: docImage, link: '/loc-docs', text: 'Documentos' }
      ]
    }
  ];

  return (
    <>
      <GlobalStyle />
      <UserContextProvider value={{ state, setState }}>
        <Routes>
          <Route path='/login' element={<LoginPage title='Login ' />} />
          <Route
            path='/'
            element={
              <LoggedLayout title='Home'>
                <Home items={midLevelItems[0].items} />
              </LoggedLayout>
            }
          />
          <Route
            path='/cond'
            element={
              <LoggedLayout title='Condominio'>
                <MidLevelPage
                  backLink='/'
                  text='Condomínio'
                  items={midLevelItems[1].items}
                />
              </LoggedLayout>
            }
          />
          <Route
            path='/loc'
            element={
              <LoggedLayout title='Pool'>
                <MidLevelPage
                  text='Pool'
                  backLink='/'
                  items={midLevelItems[2].items}
                />
              </LoggedLayout>
            }
          />
          <Route
            path='/change-password'
            element={
              <>
                {novaSenha === 'true' ? (
                  <Layout title='Redefinição de senha'>
                    <PasswordReset />
                  </Layout>
                ) : (
                  <LoggedLayout title='Redefinição de senha'>
                    <PasswordReset />
                  </LoggedLayout>
                )}
              </>
            }
          />
          <Route
            path='/forgot-password'
            exact
            element={
              <Layout title='Esqueci minha senha'>
                <ForgotPassword />
              </Layout>
            }
          />
          <Route
            path='/generate-bill'
            element={
              <LoggedLayout title='Emitir 2 via de boleto'>
                <GenerateBill type='bill' />
              </LoggedLayout>
            }
          />
          <Route
            path='/loc-docs'
            element={
              <LoggedLayout title='Documentos de pool'>
                <Documents type='L' />
              </LoggedLayout>
            }
          />
          <Route
            path='/cond-docs'
            element={
              <LoggedLayout title='Documentos do condomínio'>
                <Documents type='C' />
              </LoggedLayout>
            }
          />
          <Route
            path='/statement'
            element={
              <LoggedLayout title='Extrato de locação'>
                <Statement />
              </LoggedLayout>
            }
          />
          <Route
            path='/news'
            element={
              <LoggedLayout title='Acontece no Costão'>
                <News />
              </LoggedLayout>
            }
          />
          <Route
            path='/dependent-registration'
            element={
              <LoggedLayout title='Cadastro de dependente'>
                <DependantRegistration />
              </LoggedLayout>
            }
          />
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
