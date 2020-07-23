import React from 'react';
import PropTypes from 'prop-types';

import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  console.log('currentUser: ', currentUser);
  return (
    <div>
      index

    </div>
  );
};
LandingPage.getInitialProps = async (context) => {
  const { data: currentUser } = await buildClient(context).get('/api/users/currentuser');
  return {
    currentUser,
  };
};
LandingPage.defaultProps = {
  currentUser: null,
};
LandingPage.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.string,
    iat: PropTypes.number,
  }),
};
export default LandingPage;
