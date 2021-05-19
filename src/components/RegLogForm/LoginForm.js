import React, { useRef, useContext, useState, useEffect } from "react";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import APIContext from "../../store/api-context";
import AuthContext from "../../store/auth-context";
import useHttp from '../../hooks/use-http';

import classes from "./RegForm.module.scss";
import CardClasses from "../UI/Card/Card.module.scss";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [emailIsCorrect, setEmailIsCorrect] = useState(true);
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(true);
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const { isLoading, isDone: registrationIsDone, sendRequest: sendRegistrationRequest } = useHttp();

  const { onLogin: logginUser } = ctxAuth;
  
  useEffect(() => {
    if(registrationIsDone) logginUser(email);
  }, [registrationIsDone, logginUser, email]);

  function fetchHandler(emailInput, passwordInput) {
    sendRegistrationRequest(
      {
        url: `${ctxAPI.host}/api/login.php/`,
        method: 'POST',
        body: {
          email: emailInput,
          password: passwordInput
        }
      },
      (data) => {
        if (data.code === 0) {
          return true;
        } else if (data.code === 1) {
          setEmailIsCorrect(false);
          return false;
        } else if (data.code === 2) {
          setPasswordIsCorrect(false);
          return false;
        }
      }
    );
  }

  function loginHandler(e) {
    e.preventDefault();
    const emailInput = emailInputRef.current.value;
    const passwordInput = passwordInputRef.current.value;
    setEmail(emailInputRef.current.value);
    setEmailIsCorrect(true);
    setPasswordIsCorrect(true);

    if (emailInput && passwordInput) {
      fetchHandler(emailInput, passwordInput);
    } else {
      setEmailIsCorrect(false);
      setPasswordIsCorrect(false);
    }
  }
  
  return (
    <Card className={CardClasses['card--relative']}>
      <form className={classes.form} onSubmit={loginHandler}>
        <Input
          ref={emailInputRef}
          id="userEmail"
          label="Your email"
          input={{
            type: "text",
            name: "userEmail",
            placeholder: "Enter email",
          }}
          isValid={emailIsCorrect}
          errorMsg="Incorect email"
          customClasses={classes.row}
        />
        <Input
          ref={passwordInputRef}
          id="newPassword"
          label="Enter your password"
          input={{
            type: "password",
            name: "newPassword",
            placeholder: "******",
          }}
          isValid={passwordIsCorrect}
          errorMsg="Incorect password"
          customClasses={classes.row}
        />
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <Button
            btnText="Sign in"
            btn={{
              type: "submit",
              id: "submitLogin",
              name: "submitLogin",
              value: "1",
            }}
          />
        </div>
      </form>
      {isLoading && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
    </Card>
  );
}

export default LoginForm;
