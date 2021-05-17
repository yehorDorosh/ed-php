import React, { useRef, useContext, useState, Fragment } from "react";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import APIContext from "../../store/api-context";
import ModalContext from "../../store/modal-context";
import AuthContext from "../../store/auth-context";

import classes from "./RegForm.module.scss";
import CardClasses from "../UI/Card/Card.module.scss";

function LoginForm() {
  const [emailIsCorrect, setEmailIsCorrect] = useState(true);
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function fetchHandler(emailInput, passwordInput) {
    setIsLoading(true);
    fetch(`${ctxAPI.host}/api/login.php/`, {
      method: 'POST',
      body: JSON.stringify({
        email: emailInput,
        password: passwordInput
      })
    })
    .then(response => {
      if (response.ok) {
        setIsLoading(false);
        return response.json();
      } else {
        throw new Error(`HTTP error - ${response.status}`);
      }
    })
    .then(data => {
      if (data.code === 0) {
        ctxAuth.onLogin(data.email);
      } else if (data.code === 1) {
        setEmailIsCorrect(false);
      } else if (data.code === 2) {
        setPasswordIsCorrect(false);
      }
    })
    .catch(error => {
      console.log(error);
      setIsLoading(false);
      ctxModal.onShown(
        <Fragment>
          <p>Registration was faild.</p>
          <p>Some network problems was occur:</p>
          <p>{String(error)}</p>
          <Button btnText="OK" onClick={ctxModal.onClose} />
        </Fragment>
      );
    });
  }

  function loginHandler(e) {
    e.preventDefault();
    const emailInput = emailInputRef.current.value;
    const passwordInput = passwordInputRef.current.value;
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
