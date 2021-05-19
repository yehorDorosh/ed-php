import { useContext, Fragment } from 'react';

import Button from '../../UI/Button/Button';
import Wrapper from '../Wrapper/Wrapper';
import AuthContext from '../../../store/auth-context';
import APIContext from '../../../store/api-context';
import useHttp from '../../../hooks/use-http';

import classes from './Header.module.scss';

function Header() {
  const { isLoading, userDeleteError, sendRequest: sendDeleteUserRequest } = useHttp();
  const ctxAPI = useContext(APIContext);

  const ctxAuth = useContext(AuthContext);

  function deleteUser() {
    sendDeleteUserRequest(
      {
        url: `${ctxAPI.host}/api/rm-user.php/`,
        method: 'DELETE',
        body: {
          email: ctxAuth.email
        }
      },
      (data) => {
        ctxAuth.onLogout();
      }
    );
  }

  const logOutBtn = (
    <Fragment>
      {isLoading && !userDeleteError &&  <span>Deleting...</span>}
      <Button btnText="Delete user" onClick={deleteUser}/>
      <span>{ctxAuth.email} </span>
      <Button btnText="Log out" onClick={ctxAuth.onLogout}/>
    </Fragment>
  );

  return (
    <header className={classes.header}>
      <Wrapper className={classes.inner}>
        {ctxAuth.isLoggedIn && logOutBtn}
      </Wrapper>
    </header>
  );
}

export default Header;