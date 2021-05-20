import React, { useState, useContext, Fragment, useEffect } from "react";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import APIContext from "../../store/api-context";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";
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

function RegForm() {
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const [passIsEqual, setPassIsEqual] = useState(true);
  const [isUniqueEmail, setIsUniqueEmail] = useState(true);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(validateEmail);
  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(validatePassword);
  const {
    value: checkPassword,
    isValid: checkPasswordIsValid,
    hasError: checkPasswordError,
    isTouched: checkPasswordTouched,
    valueChangeHandler: checkPasswordChangeHandler,
    inputBlurHandler: checkPasswordBlurHandler,
  } = useInput(validatePassword);

  const { isLoading, isDone: registrationIsDone, sendRequest: sendRegistrationRequest } = useHttp();

  const { onLogin: logginUser } = ctxAuth;
  
  useEffect(() => {
    if(registrationIsDone) {
      logginUser(email);
    }
  }, [registrationIsDone, logginUser, email]);

  useEffect(() => {
    if(checkPassword !== password && checkPasswordTouched) {
      setPassIsEqual(false);
    } else {
      setPassIsEqual(true);
    }
  }, [checkPassword, password, checkPasswordTouched]);

  function fetchHandler() {
    sendRegistrationRequest(
      {
        url: `${ctxAPI.host}/api/registration.php/`,
        method: 'POST',
        body: {
          email: email,
          password: password
        }
      },
      (data) => {
        if (data.code === 0) {
          ctxModal.onShown(
            <Fragment>
              <p>Welcome!</p>
              <p>You have been registered under the name:</p>
              <p>{data.email}</p>
              <Button btnText="OK" onClick={ctxModal.onClose} />
            </Fragment>
          );
          return true;
        } else if (data.code === 1) {
          setIsUniqueEmail(false);
          return false;
        }
      }
    );
  }

  function regHandler(e) {
    e.preventDefault();
    setIsUniqueEmail(true);
    if (
      email &&
      password &&
      emailIsValid &&
      passwordIsValid &&
      checkPasswordIsValid &&
      password === checkPassword
    ) {
      setPassIsEqual(true);
      fetchHandler();
    } else {
      emailBlurHandler();
      passwordBlurHandler();
      checkPasswordBlurHandler();
    }
  }

  return (
    <Card className={CardClasses['card--relative']}>
      <form className={classes.form} onSubmit={regHandler}>
        <Input
          id="userEmail"
          label="Your email"
          input={{
            type: "email",
            name: "userEmail",
            placeholder: "Enter email",
          }}
          onChange={emailChangeHandler}
          isValid={isUniqueEmail && !emailError}
          errorMsg={isUniqueEmail === false ? "Current email already is exist" : "Invalid email"}
          onBlur={emailBlurHandler}
          //value={emailState.value}
          customClasses={classes.row}
        />
        <Input
          id="newPassword"
          label="Enter your password"
          input={{
            type: "password",
            name: "newPassword",
            placeholder: "******",
          }}
          onChange={passwordChangeHandler}
          isValid={!passwordError}
          errorMsg={"Password shoud be great then 5 symbols"}
          onBlur={passwordBlurHandler}
          customClasses={classes.row}
        />
        <Input
          id="repeatPassword"
          label="Please repeat your password"
          input={{
            type: "password",
            name: "repeatPassword",
            placeholder: "******",
          }}
          onChange={checkPasswordChangeHandler}
          isValid={passIsEqual && !checkPasswordError}
          errorMsg={
            passIsEqual
              ? "Password shoud be great then 5 symbols"
              : "The passwords should be match"
          }
          onBlur={checkPasswordBlurHandler}
          customClasses={classes.row}
        />
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <Button
            btnText="Send"
            btn={{
              type: "submit",
              id: "submitReg",
              name: "submitReg",
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

export default RegForm;
