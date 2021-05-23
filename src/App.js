import React, { Fragment, useContext } from 'react';

import Header from './components/Layout/Header/Header';
import Wrapper from './components/Layout/Wrapper/Wrapper';
import RegLogForm from './components/RegLogForm/RegLogForm';
import AuthContext from './store/auth-context';
import Modal from './components/UI/Modal/Modal';
import ModalContext from './store/modal-context';
import Category from './components/Category/Category';

function App() {
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  return (
    <Fragment>
      <Header />
      <Wrapper>
        <h1>My expense</h1>
        {!ctxAuth.isLoggedIn && <RegLogForm />}
        {ctxAuth.isLoggedIn && <Category />}
      </Wrapper>
      {ctxModal.isShown && <Modal onClose={ctxModal.onClose}>{ctxModal.content}</Modal>}
    </Fragment>
  );
}

export default App;
