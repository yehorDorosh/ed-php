import { useContext, Fragment } from 'react';

import Button from '../../UI/Button/Button';
import Wrapper from '../Wrapper/Wrapper';
import AuthContext from '../../../store/auth-context';
import APIContext from '../../../store/api-context';
import useHttp from '../../../hooks/use-http';

import classes from './Header.module.scss';

function Header() {
  const { isLoading, userDeleteError, sendRequest: sendDeleteUserRequest } = useHttp();
  const { sendRequest: sendWeather } = useHttp();
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

  function sendTestData() {
    sendWeather(
      {
        url: `${ctxAPI.host}/api/weather.php/`,
        method: 'POST',
        body: {
          id: '1',
          t: 30.1,
          p: '101799',
          a: '55',
          v: '3.3'
        }
      },
      (data) => {
        console.log(data);
      }
    );
  }



  const logOutBtn = (
    <Fragment>
      { ctxAuth.email === 'yehor.dorosh@ukr.net' && <Button btnText="Test weather API" onClick={sendTestData}/>}
      {isLoading && !userDeleteError &&  <span>Deleting...</span>}
      <Button btnText="Delete user" onClick={deleteUser}/>
      <span> {ctxAuth.email} </span>
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