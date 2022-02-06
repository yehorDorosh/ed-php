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
    let deleteIsConfirmed = window.confirm('Are you sure that you want to delete the account with all saved data?');
    if (!deleteIsConfirmed) return;
    let enteredEmail = window.prompt('Enter your email to confirm account deleting.');
    if (enteredEmail === null) return;
    if ( enteredEmail !== ctxAuth.email) {
      window.alert('Entered email does not mutch with current account.');
      return;
    }
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
          t: 0,
          p: '101000',
          a: '55',
          v: '3.0'
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