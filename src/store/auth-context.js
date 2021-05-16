import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  email: '',
  onLogout: () => {},
  onLogin: (email) => {}
});

export const AuthContextProvider = (props) => {
  const [isLoggenIn, setIsloggedIn] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');

  useEffect(() => {
    const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

    if (storedUserLoggedInInformation) {
      setIsloggedIn(true);
      setCurrentEmail(storedUserLoggedInInformation);
    }
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('isLoggedIn');
    setIsloggedIn(false);
    setCurrentEmail('');
  };

  const loginHandler = (email) => {
    localStorage.setItem('isLoggedIn', email);
    setIsloggedIn(true);
    setCurrentEmail(email);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggenIn,
        email: currentEmail,
        onLogout: logoutHandler,
        onLogin: loginHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
