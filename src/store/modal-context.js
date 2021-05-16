import React, { useState } from 'react';

const Modal = React.createContext({
  isShown: false,
  content: null,
  onShown: (content) => {},
  onClose: () => {}
});

export function ModalContextProvider(props) {
  const [isShown, setIsShown] = useState(false);
  const [content, setContent] = useState(null);

  function onShownHandler(content) {
    setIsShown(true);
    setContent(content);
  }

  function onCloseHandler() {
    setIsShown(false);
    setContent(null);
  }

  return (
    <Modal.Provider
      value={{
        isShown: isShown,
        content: content,
        onShown: onShownHandler,
        onClose: onCloseHandler
      }}
    >
      {props.children}
    </Modal.Provider>
  );
}

export default Modal;