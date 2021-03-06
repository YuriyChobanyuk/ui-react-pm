import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApplicationBar from './ApplicationBar';
import { authSelectors, authActions } from '../../ducks';

const ApplicationBarContainer: React.FC = () => {
  const user = useSelector(authSelectors.selectUserData);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authActions.logout());
  };

  return <ApplicationBar user={user} handleLogout={handleLogout} />;
};

export default ApplicationBarContainer;
