import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href}>
          <div className="nav-link">{label}</div>
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <div className="navbar-brand">GitTix</div>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

Header.propTypes = {
  currentUser: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
};

export default Header;
