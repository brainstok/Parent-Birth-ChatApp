import Linkify from 'react-linkify';
import PropTypes from 'prop-types';

const componentDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
);

const LinkifyWithTargetBlank = ({ children }) => {
  return <Linkify componentDecorator={componentDecorator}>{children}</Linkify>;
};

LinkifyWithTargetBlank.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LinkifyWithTargetBlank;
