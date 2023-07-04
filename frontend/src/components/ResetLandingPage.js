import React from 'react';
import MailIcon from '../assets/MailIcon.svg';
import { Link } from 'react-router-dom';
export default function ResetLandingPage() {
  return (
    <>
      <div className='ResetLandingPage'>
        <div className='OuterContainer'>
          <div className='InnerContainer'>
            <img src={MailIcon} alt='' className='mb-4' />
            <h1 className='boldFont'>Mail Sent to your Registered Email Id</h1>
            <Link className='TextB' to='/login' role='button'>
              Retry Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
