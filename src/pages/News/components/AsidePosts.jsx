import { isMobile } from 'react-device-detect';
import { DividerHorizontal, Text } from '../../../styles';

const AsidePosts = ({ posts, onClick }) => {
  const getImageURL = (post) => {
    const html = new DOMParser().parseFromString(
      post.content.rendered,
      'text/xml'
    );
    const imgs = html.getElementsByTagName('img');
    const props = imgs[0].attributes.src.value;
    return props;
  };

  return (
    <aside style={{ marginTop: '8em', padding: '0 1.5em' }}>
      <Text size='22px' padding='0 0 2em' color='#000040'>
        Últimas Notícias
      </Text>
      <DividerHorizontal width='100%' />
      {posts.map((post) => (
        <div
          style={{ paddingTop: '2em', cursor: 'pointer' }}
          role='button'
          onClick={() => onClick(post.id)}
        >
          <img
            style={{
              height: isMobile ? '100px' : '200px',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'top center'
            }}
            src={getImageURL(post)}
            alt={post.title}
          />
          <Text size='18px' color='#444'>
            {post.title.rendered}
          </Text>
          <DividerHorizontal width='100%' padding='1em' />
        </div>
      ))}
    </aside>
  );
};

export default AsidePosts;
