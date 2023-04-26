import styled from 'styled-components';
import { colors } from '../../theme';

export const Container = styled.section`
  height: 100%;
  width: 100%;
  font-family: var(--e-global-typography-text-font-family);
  color: ${colors.lightGray}
`;

export const Post = styled.div`
  min-height: 400px;
  border-bottom: 1px solid ${colors.gray};
  padding: 3em 1em;
  display: flex;
  flex-direction: column;

  iframe {
    display: flex;
    margin: auto;
    align-items: center;
  }
`;
