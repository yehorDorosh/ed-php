import React, { useContext } from 'react';

import Wrapper from './components/Layout/Wrapper/Wrapper';
import RegForm from './components/RegForm/RegForm';
import AuthContext from './store/auth-context';

function App() {
  const ctxAuth = useContext(AuthContext);
  console.log(ctxAuth);
  return (
    <Wrapper>
      <h1>My expense</h1>
      <RegForm />
    </Wrapper>
  );
}

export default App;
