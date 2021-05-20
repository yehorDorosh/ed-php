import React, { useContext, useState, useEffect } from "react";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import APIContext from "../../store/api-context";
import AuthContext from "../../store/auth-context";
import useHttp from '../../hooks/use-http';
import useInput from '../../hooks/use-input';

import classes from "./RegForm.module.scss";
import CardClasses from "../UI/Card/Card.module.scss";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(pass) {
  return String(pass).length >= 6;
}

function LoginForm() {
  const [emailIsCorrect, setEmailIsCorrect] = useState(null);
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(null);
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailError,
    isTouched: emailIsTouched,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(validateEmail);
  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordError,
    isTouched: passwordIsTouched,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(validatePassword);

  const { isLoading, isDone: registrationIsDone, sendRequest: sendRegistrationRequest } = useHttp();

  const { onLogin: logginUser } = ctxAuth;
  
  useEffect(() => {
    if(registrationIsDone) logginUser(email);
  }, [registrationIsDone, logginUser, email]);

  useEffect(() => {
    if (emailIsTouched) setEmailIsCorrect(true);
    if (passwordIsTouched) setPasswordIsCorrect(true);
  }, [emailIsTouched, passwordIsTouched]);

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
    setEmailIsCorrect(true);
    setPasswordIsCorrect(true);

    if (email && password && emailIsValid && passwordIsValid) {
      fetchHandler(email, password);
    }
  }

  return (
    <Card className={CardClasses['card--relative']}>
      <form className={classes.form} onSubmit={loginHandler}>
        <Input
          id="userEmail"
          label="Your email"
          input={{
            type: "email",
            name: "userEmail",
            placeholder: "Enter email",
          }}
          isValid={!emailError && emailIsCorrect}
          errorMsg={emailIsCorrect ? "Invalid email" : "Incorect email"}
          customClasses={classes.row}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
        />
        <Input
          id="newPassword"
          label="Enter your password"
          input={{
            type: "password",
            name: "newPassword",
            placeholder: "******",
          }}
          isValid={!passwordError && passwordIsCorrect}
          errorMsg={passwordIsCorrect ? "Invalid password" : "Incorect password"}
          customClasses={classes.row}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
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
