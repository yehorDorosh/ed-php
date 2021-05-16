import React, { Fragment, useContext } from 'react';

import Header from './components/Layout/Header/Header';
import Wrapper from './components/Layout/Wrapper/Wrapper';
import RegLogForm from './components/RegLogForm/RegLogForm';
import AuthContext from './store/auth-context';

function App() {
  const ctxAuth = useContext(AuthContext);

  return (
    <Fragment>
      <Header />
      <Wrapper>
        <h1>My expense</h1>
        {!ctxAuth.isLoggedIn && <RegLogForm />}
      </Wrapper>
    </Fragment>
  );
}

export default App;
