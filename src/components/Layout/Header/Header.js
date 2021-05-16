import { useContext } from 'react';

import Button from '../../UI/Button/Button';
import Wrapper from '../Wrapper/Wrapper';
import AuthContext from '../../../store/auth-context';

import classes from './Header.module.scss';

function Header() {
  const ctxAuth = useContext(AuthContext);

  return (
    <header className={classes.header}>
      <Wrapper className={classes.inner}>
        <Button btnText="Log out" onClick={ctxAuth.onLogout} />
      </Wrapper>
    </header>
  );
}

export default Header;