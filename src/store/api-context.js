import React, { useContext } from 'react';

const APIContext = React.createContext({
  localEnv: 'http://localhost:7777',
  prodEnv: 'http://35.178.207.100',
  host: 'http://35.178.207.100'
});

export function APIContextProvider(props) {
  const ctx = useContext(APIContext);

  return (
    <APIContext.Provider
      value={{
        localEnv: 'http://localhost:7777',
        prodEnv: 'http://35.178.207.100',
        host: window.ENV_MODE ? ctx.prodEnv : ctx.localEnv
      }}
    >
      {props.children}
    </APIContext.Provider>
  );
}

export default APIContext;