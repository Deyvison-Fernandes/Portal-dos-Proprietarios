import styled from 'styled-components';

const ImgRender = styled.img`
  width: ${({ width }) => width || '100px'};
  height: ${({ height }) => height || '100px'};
  @media (max-width: 500px) {
    width: ${({ width }) => width || '50px'};
    height: ${({ height }) => height || '50px'};
  }
`;

export { ImgRender };
