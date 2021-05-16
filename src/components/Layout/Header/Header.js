import { useContext, Fragment } from 'react';

import Button from '../../UI/Button/Button';
import Wrapper from '../Wrapper/Wrapper';
import AuthContext from '../../../store/auth-context';

import classes from './Header.module.scss';

function Header() {
  const ctxAuth = useContext(AuthContext);
  const logOutBtn = (
    <Fragment>
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