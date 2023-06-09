import { api } from '../../services/api';
import {
  Aligner,
  ButtonSubmit,
  FlexItem,
  Input,
  LinkItem,
  SectionTitle,
  Text
} from '../../styles';
import { colors, weight } from '../../theme';
import { useState } from 'react';
import { Alert } from '../../components';
import { useNavigate } from 'react-router';

const ForgotPassword = () => {
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState();
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    const obj = {};
    for (let [key, value] of formData.entries()) {
      obj[key] = value;
    }

    const { email } = obj;

    api
      .post('/senha', {
        email: email
      })
      .then((res) => {
        setAlertType('success');
        setAlertMessage('A nova senha chegará em seu email em alguns minutos!');
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
          navigate('/login');
        }, 3000);
      })
      .catch((error) => {
        setAlertType('error');
        setAlertMessage(`Erro! ${error.message}`);
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
        }, 3000);
      });
  };

  return (
    <>
      {alertOpen && <Alert message={alertMessage} type={alertType} />}
      <FlexItem margin='50px auto 0' isFlex width='400px'>
        <LinkItem onClick={() => navigate('/login')} hasCursor align='left'>
          Voltar para login
        </LinkItem>
        <form onSubmit={handleSubmit} style={{ margin: 'auto' }}>
          <SectionTitle
            color={colors.primary}
            align='left'
            weight={weight.bold}
          >
            Esqueci minha senha
          </SectionTitle>
          <Text color={colors.primary} weight={weight.semibold}>
            Informe seu e-mail
          </Text>
          <Input
            mWidth='300px'
            height='30px'
            color={colors.primary}
            name='email'
            type='email'
            isFlex
          />
          <Aligner direction='center'>
            <ButtonSubmit type='submit'>Enviar</ButtonSubmit>
          </Aligner>
        </form>
      </FlexItem>
    </>
  );
};

export default ForgotPassword;
