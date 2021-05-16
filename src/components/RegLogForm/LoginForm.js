import React, { useRef, useContext, useState } from "react";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import APIContext from "../../store/api-context";
import AuthContext from "../../store/auth-context";

import classes from "./RegForm.module.scss";

function LoginForm() {
  const [emailIsCorrect, setEmailIsCorrect] = useState(true);
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(true);
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function loginHandler(e) {
    e.preventDefault();
    const emailInput = emailInputRef.current.value;
    const passwordInput = passwordInputRef.current.value;
    setEmailIsCorrect(true);
    setPasswordIsCorrect(true);

    if (emailInput && passwordInput) {
      fetch(`${ctxAPI.host}/api/login.php/`, {
        method: 'POST',
        body: JSON.stringify({
          email: emailInput,
          password: passwordInput
        })
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Ошибка HTTP: " + response.status);
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
      .catch(error => console.log(error));
    } else {
      setEmailIsCorrect(false);
      setPasswordIsCorrect(false);
    }
  }
  
  return (
    <Card>
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
    </Card>
  );
}

export default LoginForm;
