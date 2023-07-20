// Layout.js
import React from 'react';
import NavbarComp from '../components/navbar';

const Layout = ({ showNavbar, children, user }) => {
    const userPicture='https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80'

  return (
    <>
      {showNavbar && <NavbarComp user={user} userPicture={userPicture}/>}
      {children}
    </>
  );
};

export default Layout;
