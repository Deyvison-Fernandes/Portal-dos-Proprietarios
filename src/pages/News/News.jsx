import { useEffect, useState } from 'react';
import { apiWp } from '../../services/api-wp';
import parse from 'html-react-parser';
import { Text, Title } from '../../styles';
import { colors, fontSize } from '../../theme';
import { formatDate } from '../../utils';
import { Container, Post } from './News.style';
import AsidePosts from './components/AsidePosts';
import { isMobile } from 'react-device-detect';

function News() {
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);

  const getPosts = async () => {
    await apiWp.get('/posts').then((response) => {
      setPosts(response.data);
      setSelectedPosts(response.data);
    });
  };

  const buildHtml = (html) => {
    if (!html) return;
    let link = '';

    return parse(html, {
      replace: (domNode) => {
        if (
          domNode.attribs &&
          domNode.attribs.class === 'elementor-facebook-widget fb-post'
        ) {
          link = domNode.attribs['data-href'];
          if (link.includes('facebook')) {
            return (
              <iframe
                title={link}
                src={`https://www.facebook.com/plugins/post.php?href=${link}&show_text=true&width=500`}
                width='500'
                height='667'
                style={{ border: 'none', overflow: 'hidden' }}
                allowFullScreen
                allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
              ></iframe>
            );
          }
        }
        if (
          domNode.attribs &&
          domNode.attribs?.class?.includes('elementor-widget-video')
        ) {
          link = domNode.attribs['data-settings'];
          link = JSON.parse(link);
          if (link?.youtube_url) {
            let linkYoutube = link.youtube_url.slice(
              link.youtube_url.indexOf('=') + 1
            );

            return (
              <iframe
                width='560'
                height='315'
                src={`https://www.youtube.com/embed/${linkYoutube}`}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            );
          }
        }
        if (domNode.tagName === 'img') {
          return (
            <div style={{ width: '100%' }}>
              <img
                style={{ width: '100%' }}
                src={domNode.attribs.src}
                alt={domNode.attribs.alt}
              />
            </div>
          );
        }
      }
    });
  };

  const handlePostClick = (id) => {
    const pSelect = posts.filter((p) => p.id === id);
    setSelectedPosts(pSelect);
    window.scrollTo(0, 400);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Container>
      {!selectedPosts ? (
        <h3>Não há posts</h3>
      ) : (
        <>
          <div
            style={{
              backgroundColor: colors.primary,
              height: '80px',
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '30px'
            }}
          >
            <Title
              color={colors.white}
              fontSize='30px'
              shadow
              margin='0'
              padding='0'
            >
              Acontece no Costão
            </Title>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '1em',
              flexDirection: isMobile ? 'column' : 'row'
            }}
          >
            <div style={{ width: isMobile ? '100%' : '75%' }}>
              {selectedPosts.map((item, index) => (
                <Post key={`post-${index}`}>
                  <Text size={fontSize.text}>{formatDate(item.date)}</Text>
                  <Text
                    textAlign='left'
                    color={colors.primary}
                    size={fontSize.titleSection}
                    weight='600'
                  >
                    {item.title.rendered}
                  </Text>
                  <Text>{buildHtml(item.content.rendered)}</Text>
                </Post>
              ))}
            </div>
            <div style={{ width: isMobile ? '100%' : '25%' }}>
              {posts.length > 0 && (
                <AsidePosts posts={posts} onClick={handlePostClick} />
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

export default News;
