import { useCallback, useContext, Fragment, useState } from 'react';

import ModalContext from '../store/modal-context';
import Button from '../components/UI/Button/Button';

function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDone, setIsDone] = useState(null);
  const ctxModal = useContext(ModalContext);
  const { onShown: showErrorPopup, onClose: closeErrorPopup} = ctxModal;

  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });
      if (!response.ok) throw new Error(`HTTP error - ${response.status}`);
      const data = await response.json();
      if (applyData(data) === true) setIsDone(true); 
    } catch (error) {
      console.log(error);
      setError(error.message || 'Something went wrong!');
      showErrorPopup(
        <Fragment>
          <p>Some network problems was occur:</p>
          <p>{String(error)}</p>
          <Button btnText="OK" onClick={closeErrorPopup} />
        </Fragment>
      );
    }
    setIsLoading(false);
  }, [showErrorPopup, closeErrorPopup]);

  return {
    isLoading,
    isDone,
    error,
    sendRequest,
  }
}

export default useHttp;