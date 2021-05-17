import React, { useReducer, useRef, useState, useContext, Fragment } from "react";

import Card from "../UI/Card/Card";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import APIContext from "../../store/api-context";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";

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

function fieldReducer(state, action, validator) {
  if (action.type === "USER_INPUT") {
    if (state.isValid === false) {
      return {
        value: action.value,
        isValid: validator(action.value),
      };
    }
    return {
      value: action.value,
    };
  }
  if (action.type === "INPUT_BLUR") {
    return {
      value: action.value,
      isValid: validator(action.value),
    };
  }

  if (action.type === "SUBMIT_PREVENT") {
    return {
      isValid: validator(action.value),
    };
  }
}

function fieldDispath(dispath, ref, action) {
  dispath({ type: action, value: ref.current.value.trim() });
}

const defaultFieldState = {
  value: "",
  isValid: null,
};

function RegForm() {
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const checkPassInputRef = useRef();
  const [passIsEqual, setPassIsEqual] = useState(true);
  const [isUniqueEmail, setIsUniqueEmail] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailState, dispathEmail] = useReducer(
    (state, action) => {
      return fieldReducer(state, action, validateEmail);
    },
    { ...defaultFieldState }
  );
  const [passwordState, dispathPassword] = useReducer(
    (state, action) => {
      return fieldReducer(state, action, validatePassword);
    },
    { ...defaultFieldState }
  );
  const [checkPassState, dispathCheckPass] = useReducer(
    (state, action) => {
      return fieldReducer(state, action, validatePassword);
    },
    { ...defaultFieldState }
  );

  function inputChangeHandler(e) {
    if (e.target === emailInputRef.current)
      fieldDispath(dispathEmail, emailInputRef, "USER_INPUT");
    if (e.target === passwordInputRef.current)
      fieldDispath(dispathPassword, passwordInputRef, "USER_INPUT");
    if (e.target === checkPassInputRef.current) {
      fieldDispath(dispathCheckPass, checkPassInputRef, "USER_INPUT");
      setPassIsEqual(true);
    }
  }

  function inputOnBlur(e) {
    if (e.target === emailInputRef.current)
      fieldDispath(dispathEmail, emailInputRef, "INPUT_BLUR");
    if (e.target === passwordInputRef.current)
      fieldDispath(dispathPassword, passwordInputRef, "INPUT_BLUR");
    if (e.target === checkPassInputRef.current) {
      fieldDispath(dispathCheckPass, checkPassInputRef, "INPUT_BLUR");
      if (passwordState.value === checkPassState.value) {
        setPassIsEqual(true);
      } else {
        setPassIsEqual(false);
      }
    }
  }

  function fetchHandler() {
    setIsLoading(true);
    fetch(`${ctxAPI.host}/api/registration.php/`, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({
        email: emailState.value,
        password: passwordState.value
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
        ctxModal.onShown(
          <Fragment>
            <p>Welcome!</p>
            <p>You have been registered under the name:</p>
            <p>{data.email}</p>
            <Button btnText="OK" onClick={ctxModal.onClose} />
          </Fragment>
        );
        ctxAuth.onLogin(data.email);
      } else if (data.code === 1) {
        setIsUniqueEmail(false);
      }
    })
    .catch(error => {
      setIsLoading(false);
      console.log(error);
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

  function regHandler(e) {
    e.preventDefault();
    setIsUniqueEmail(true);
    if (
      emailState.value &&
      passwordState.value &&
      emailState.isValid &&
      passwordState.isValid &&
      checkPassState.isValid &&
      passwordState.value === checkPassState.value
    ) {
      setPassIsEqual(true);
      fetchHandler();
    } else {
      fieldDispath(dispathEmail, emailInputRef, "SUBMIT_PREVENT");
      fieldDispath(dispathPassword, passwordInputRef, "SUBMIT_PREVENT");
      fieldDispath(dispathCheckPass, checkPassInputRef, "SUBMIT_PREVENT");
    }
  }

  return (
    <Card className={CardClasses['card--relative']}>
      <form className={classes.form} onSubmit={regHandler}>
        <Input
          ref={emailInputRef}
          id="userEmail"
          label="Your email"
          input={{
            type: "text",
            name: "userEmail",
            placeholder: "Enter email",
          }}
          onChange={inputChangeHandler}
          isValid={isUniqueEmail && emailState.isValid}
          errorMsg={isUniqueEmail === false ? "Current email already is exist" : "Invalid email"}
          onBlur={inputOnBlur}
          //value={emailState.value}
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
          onChange={inputChangeHandler}
          isValid={passwordState.isValid}
          errorMsg={"Password shoud be great then 5 symbols"}
          onBlur={inputOnBlur}
          customClasses={classes.row}
        />
        <Input
          ref={checkPassInputRef}
          id="repeatPassword"
          label="Please repeat your password"
          input={{
            type: "password",
            name: "repeatPassword",
            placeholder: "******",
          }}
          onChange={inputChangeHandler}
          isValid={passIsEqual && checkPassState.isValid}
          errorMsg={
            passIsEqual
              ? "Password shoud be great then 5 symbols"
              : "The passwords should be match"
          }
          onBlur={inputOnBlur}
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
