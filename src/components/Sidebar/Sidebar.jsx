import { Link as LinkRouter, useNavigate } from 'react-router-dom';
import { SidebarArea, SidebarContainer, SidebarItemsArea } from './styles';
import { DividerHorizontal, Link, LogoYellowBlue, Text } from '../../styles';
import { colors, weight, fontSize } from '../../theme';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const items = [
    {
      section: 'Condomínio',
      subitems: [
        { text: 'Emitir 2ª via de boleto', link: '/generate-bill' },
        { text: 'Documentos', link: '/cond-docs' }
      ]
    },
    {
      section: 'Pool',
      subitems: [
        { text: 'Extrato de locação', link: '/statement' },
        { text: 'Documentos', link: '/loc-docs' },
        // { text: 'Cadastro de dependente', link: '/dependent-registration' }
      ]
    }
  ];

  return (
    <>
      <SidebarContainer sidebarOpen={isOpen} onClick={() => toggleSidebar()} />
      <SidebarArea open={isOpen}>
        <LinkRouter to='/'>
          <LogoYellowBlue width='130px' height='130px' margin='50px auto' />
        </LinkRouter>
        <SidebarItemsArea>
          {items.map((item, indIt) => (
            <div key={`li-${indIt}`}>
              <Text
                weight={weight.light}
                size={fontSize.subtext}
                color={colors.primary}
                key={`item-${indIt}`}
                mb='15px'
              >
                {item.section}
              </Text>
              {item.subitems.map((subItem, indSub) => (
                <Link
                  decoration='none'
                  p='5px'
                  onClick={() => navigate(subItem.link)}
                  key={`sub-${indSub}`}
                >
                  {subItem.text}
                </Link>
              ))}
              <DividerHorizontal key={`div-${indIt}`} padding='30px 0 0' />
            </div>
          ))}
          <Link
            color={colors.secondary}
            p='15px 0'
            w='800'
            onClick={() => navigate('/news')}
            key={`sub-news-page`}
          >
            ACONTECE NO COSTÃO
          </Link>
        </SidebarItemsArea>
      </SidebarArea>
    </>
  );
};

export default Sidebar;
