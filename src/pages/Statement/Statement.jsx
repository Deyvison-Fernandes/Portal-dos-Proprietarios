import { useEffect, useState, useContext } from 'react';
import { api } from '../../services/api';
import { colors, weight } from '../../theme';
import './style.css';

import {
  Aligner,
  FlexItem,
  Input,
  SectionTitle,
  Table,
  TableBody,
  TableBodyItem,
  TableContainer,
  TableHeader,
  TableHeaderItem,
  TableRow,
  Text,
  TextItem
} from '../../styles';
import { Select } from '../../components';
import UserContext from '../../context/UserContext';
import downloadImg from '../../assets/download.svg';
import { downloadStatement } from '../../services/download-statement';
import ModalDetail from './components/ModalDetail';
import { isMobile } from 'react-device-detect';
import { downloadFile } from '../../services/downloadfs';

function Statement() {
  const token = localStorage.getItem('token');
  const [data, setData] = useState(null);
  const [message, setMessage] = useState();
  const [monthYear, setMonthYear] = useState('042022');
  const [uhs, setUhs] = useState(0);
  const [uhSetted, setUhSetted] = useState(null);
  const { state, setState } = useContext(UserContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [detailModal, setDetailModal] = useState(null);

  const date = new Date();
  const month =
    date.getMonth() > 9 && date.getMonth()
      ? date.getMonth()
      : `0${date.getMonth()}`;
  const my = `${date.getFullYear()}-${month}`;

  const formattedValue = (value) => {
    const my = value.replace(/[^0-9]/g, '');
    const y = my.slice(0, 4);
    let m = my.slice(4, 6);
    return `${m}${y}`;
  };
  const formatMessage = (message) => {
    let date = message.substring(message.indexOf(`ser`), message.length);
    date = date.slice(4, 7) + ` de` + date.slice(7, date.length);
    const newM = `Dados disponívels para visualização a partir de ${date} - (Data da implantação do sistema)`;
    return newM;
  };

  const handleDownloadDetail = async (range, apto) => {
    const res = window.confirm(
      'Deseja efetuar o download do documento em PDF?'
    );
    if (res) {
      setState({ ...state, loading: true });
      await downloadFile('Extrato_detalhado.pdf', range, apto);
      setTimeout(() => {
        setState({ ...state, loading: false });
      }, 1000);
    }
    setModalOpen(false);
  };
  const fetchDocs = (token, my, uh) => {
    setState({ ...state, loading: true });
    api
      .get(`/uh/${uh}/extrato?mesano=${my}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setState({ ...state, loading: false });
        if (typeof res.data === 'string') {
          setMessage(res.data);
          setData(null);
        } else {
          setMessage(null);
          setData(res.data);
          setState({ ...state, loading: false });
        }
      })
      .catch(() => {
        setData(null);
        setState({ ...state, loading: false });
      });
  };

  const fetchUhs = (token) => {
    api
      .get('/uh', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        setUhs(res.data);
        setUhSetted(res.data[0].id);
      });
  };

  useEffect(() => {
    fetchUhs(token);
    setMonthYear(formattedValue(my));
    setState({
      ...state,
      breadcrumb: [
        {
          text: 'Home',
          link: '/'
        },
        { text: 'Pool', link: '/loc' },
        { text: 'Extrato de Locação' }
      ]
    });
  }, [token, my]);

  useEffect(() => {
    fetchDocs(token, monthYear, uhSetted);
  }, [token, monthYear, uhSetted, my]);

  useEffect(() => {
    if (isModalOpen) {
      window.scrollTo(0, 0);
    }
  }, [isModalOpen]);

  const isNeg = (value) => {
    const hasSign = value.indexOf('-');
    if (hasSign === 0) return true;
    return false;
  };

  const handleInputDateChange = (e) => {
    const { value } = e.target;

    const newV = formattedValue(value);

    if (newV.length === 6) {
      setMonthYear(newV);
    }
  };

  const handleUhChange = (e) => {
    setUhSetted(e.target.value);
  };

  const handleDownloadMobile = async () => {
    await setModalOpen(true);
    const el = document.getElementById('download-button');
    await el.click();
    setModalOpen(false);
  };

  return (
    <>
      {isModalOpen && (
        <div className='modal-container'>
          <dialog open={isModalOpen}>
            <span
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', right: '10px', cursor: 'pointer' }}
            >
              x
            </span>
            <summary
              style={{
                display: 'flex',
                alignContent: 'center',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <h4>Extrato detalhado</h4>
            </summary>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                height: '30px',
                marginLeft: '0',
                width: '100%',
                cursor: 'pointer'
              }}
              role='button'
              id='download-button'
              onClick={() => handleDownloadDetail(my, uhSetted)}
            >
              <Text mt='0' size='12px' style={{ cursor: 'pointer' }}>
                Download do extrato
              </Text>
              <img
                title='Download do extrato'
                className='download-icon'
                src={downloadImg}
                alt='download icon'
                style={{ width: '15px', marginLeft: '10px' }}
              />
            </div>
            {detailModal && <ModalDetail data={detailModal} />}
          </dialog>
        </div>
      )}
      <FlexItem margin='0px auto 30px' isFlex width='fit-content'>
        <Aligner direction='center'>
          <SectionTitle>Extrato de locação</SectionTitle>
          <FlexItem flex={!isMobile} mPadding='0 .5em'>
            <div style={{ marginRight: '10px', display: isMobile && 'flex' }}>
              <Text>Mês/Ano</Text>
              <div style={{ marginLeft: isMobile && 'auto' }}>
                <Input
                  onChange={(e) => handleInputDateChange(e)}
                  placeholder={`Ex: ${my}`}
                  width='250px'
                  color={colors.primary}
                  defaultValue={my}
                  type='month'
                />
              </div>
            </div>
            <div style={{ display: isMobile && 'flex' }}>
              <Text>Apto</Text>
              <div
                style={{
                  marginLeft: isMobile && 'auto',
                  paddingRight: isMobile && '10px'
                }}
              >
                <Select onChange={handleUhChange} items={uhs} />
              </div>
            </div>
            <Aligner
              direction='left'
              style={{
                marginTop: isMobile ? '1em' : '4em',
                marginLeft: !isMobile && '3em'
              }}
            >
              <img
                title='Download do extrato'
                className='download-icon'
                src={downloadImg}
                alt='download icon'
                onClick={() => downloadStatement(data, my)}
              />
            </Aligner>
          </FlexItem>
          {message && (
            <SectionTitle
              mt='40px'
              weight={weight.light}
              color={colors.primary}
            >
              {formatMessage(message)}.
            </SectionTitle>
          )}
          {!data && !message ? (
            <SectionTitle
              mt='40px'
              weight={weight.light}
              color={colors.primary}
            >
              Não existem documentos para serem mostrados.
            </SectionTitle>
          ) : (
            !message && (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderItem width='85px'>Apto</TableHeaderItem>
                      <TableHeaderItem width='400px'>Data</TableHeaderItem>
                      <TableHeaderItem width='fit-content'>
                        Valor
                      </TableHeaderItem>
                    </TableRow>
                  </TableHeader>
                  <TableBody height='170px'>
                    {data?.map((itemB, indB) => (
                      <TableRow key={`row-${indB}`}>
                        <TableBodyItem
                          width='85px'
                          border
                          key={`body-${itemB.Apto}-${indB}`}
                        >
                          <h4>{itemB.Apto}</h4>
                        </TableBodyItem>
                        <TableBodyItem
                          width='400px'
                          border
                          key={`body-${itemB.Data}-xx`}
                        >
                          <TextItem>{itemB.Data}</TextItem>
                          <TextItem>{itemB.Historico}</TextItem>
                        </TableBodyItem>

                        <TableBodyItem
                          width='fit-content'
                          border
                          weight='500'
                          key={`body-${itemB.Valor}-xx`}
                        >
                          <TextItem
                            weight='500'
                            color={
                              isNeg(itemB.Valor) ? colors.red : colors.primary
                            }
                          >
                            {itemB.Valor ? `${itemB.Valor}` : 'ㅤ'}
                          </TextItem>
                          {itemB.Detalhe && (
                            <span
                              style={{
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                color: 'blue'
                              }}
                              onClick={() => {
                                setDetailModal(itemB.Detalhe);
                                setModalOpen(true);
                              }}
                            >
                              <TextItem
                                onClick={() => {
                                  isMobile && handleDownloadMobile();
                                }}
                              >
                                Extrato detalhado
                              </TextItem>
                            </span>
                          )}
                        </TableBodyItem>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}
        </Aligner>
      </FlexItem>
    </>
  );
}

export default Statement;
