/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';

const App = ({ Component, pageProps, currentUser }) => (
  <div>
    <Header currentUser={currentUser} />
    <Component {...pageProps} />
  </div>
);

App.defaultProps = {
  pageProps: {},
  currentUser: null,
};

App.getInitialProps = async (appDefaultProps) => {
  const client = buildClient(appDefaultProps.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  // eslint-disable-next-line max-len
  if (appDefaultProps.Component.getInitialProps) pageProps = await appDefaultProps.Component.getInitialProps(appDefaultProps.ctx);
  return {
    pageProps,
    ...data,
  };
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object,
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.string,
    iat: PropTypes.number,
  }),
};

export default App;
