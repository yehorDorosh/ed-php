import React, { useState, useCallback } from 'react';

const Modal = React.createContext({
  isShown: false,
  content: null,
  onShown: (content) => {},
  onClose: () => {}
});

export function ModalContextProvider(props) {
  const [isShown, setIsShown] = useState(false);
  const [content, setContent] = useState(null);

  const onShownHandler =  useCallback((content) => {
    setIsShown(true);
    setContent(content);
  }, []);

  const onCloseHandler = useCallback(() => {
    setIsShown(false);
    setContent(null);
  }, []);

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