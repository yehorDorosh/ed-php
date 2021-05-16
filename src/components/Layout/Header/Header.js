import { useContext } from 'react';

import Button from '../../UI/Button/Button';
import Wrapper from '../Wrapper/Wrapper';
import AuthContext from '../../../store/auth-context';

function Header() {
  const ctxAuth = useContext(AuthContext);

  return (
    <header>
      <Wrapper>
        <Button btnText="Log out" onClick={ctxAuth.onLogout} />
      </Wrapper>
    </header>
  );
}

export default Header;