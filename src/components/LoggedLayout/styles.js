import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

const Container = styled.div`
  margin: auto;
  width: ${({w}) => isMobile ? '100%' : w || '800px'};
  margin-top: 1.5em;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

export { Container };
