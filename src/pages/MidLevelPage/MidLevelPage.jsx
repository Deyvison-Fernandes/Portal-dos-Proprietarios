import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import { FlexItem, Text } from "../../styles";
import { ImgRender } from "./styles";
import { colors } from "../../theme";

function MidLevelPage({ backLink, items, text }) {
  const navigate = useNavigate();
  const { state, setState } = useContext(UserContext);

  useEffect(() => {
    if (backLink) {
      setState({
        ...state,
        breadcrumb: [
          {
            text: "Home",
            link: "/",
          },
          { text: text },
        ],
      });
    }
    // eslint-disable-next-line
  }, [items, backLink, text]);

  return (
    <>
      <FlexItem
        mWidth="100%"
        hasCursor
        flex
        width="100%"
        height="100%"
        minHeight="300px"
        jFlex
      >
        {items.map((item, index) => (
          <FlexItem key={index} padding="3em 2em 0" tAlign="center">
            <ImgRender
              key={item.link}
              alt={item.link}
              onClick={() => navigate(item.link)}
              src={item.src}
            />
            <Text textAlign="center" color={colors.primary}>
              {item.text}
            </Text>
          </FlexItem>
        ))}
      </FlexItem>
    </>
  );
}

export default MidLevelPage;
