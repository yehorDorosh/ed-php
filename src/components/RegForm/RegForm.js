import React, { useReducer, useRef, useState } from 'react';

import Card from '../UI/Card/Card';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';

import classes from './RegForm.module.scss';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePassword(pass) {
  return String(pass).length >= 6;
}

function fieldReducer(state, action, validator) {
  if (action.type === 'USER_INPUT') {
    if (state.isValid === false) {
      return {
        value: action.value,
        isValid: validator(action.value)
      };
    }
    return {
      value: action.value
    };
  }
  if (action.type === 'INPUT_BLUR') {
    return {
      value: action.value,
      isValid: validator(action.value)
    };
  }

  if (action.type === 'SUBMIT') {
    return {
      isValid: validator(action.value)
    };
  }
}

function fieldDispath(dispath, ref, action) {
  dispath({type: action, value: ref.current.value.trim()});
}

const defaultFieldState = {
  value: '',
  isValid: null
};

function RegForm() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const checkPassInputRef = useRef();
  const [passIsEqual, setPassIsEqual] = useState(true);
  const [emailState, dispathEmail] =  useReducer((state, action) => {
    return fieldReducer(state, action, validateEmail);
  }, {...defaultFieldState});
  const [passwordState, dispathPassword] =  useReducer((state, action) => {
    return fieldReducer(state, action, validatePassword);
  }, {...defaultFieldState});
  const [checkPassState, dispathCheckPass] =  useReducer((state, action) => {
    return fieldReducer(state, action, validatePassword);
  }, {...defaultFieldState});

  function emailChangeHandler() {
    fieldDispath(dispathEmail, emailInputRef, 'USER_INPUT');
  }
  function emailOnBlur() {
    fieldDispath(dispathEmail, emailInputRef, 'INPUT_BLUR');
  }

  function passwordChangeHandler() {
    fieldDispath(dispathPassword, passwordInputRef, 'USER_INPUT');
  }
  function passwordOnBlur() {
    fieldDispath(dispathPassword, passwordInputRef, 'INPUT_BLUR');
  }

  function checkPassChangeHandler() {
    fieldDispath(dispathCheckPass, checkPassInputRef, 'USER_INPUT');
    setPassIsEqual(true);
  }
  function checkPassOnBlur() {
    fieldDispath(dispathCheckPass, checkPassInputRef, 'INPUT_BLUR');
    if (passwordState.value === checkPassState.value) {
      setPassIsEqual(true);
    } else {
      setPassIsEqual(false);
    }
  }

  function regHandler(e) {
    e.preventDefault();
    if (emailState.isValid && passwordState.isValid && checkPassState.isValid && passwordState.value === checkPassState.value) {
      setPassIsEqual(true);
      console.log('Reg is OK');
    } else {
      fieldDispath(dispathEmail, emailInputRef, 'SUBMIT');
      fieldDispath(dispathPassword, passwordInputRef, 'SUBMIT');
      fieldDispath(dispathCheckPass, checkPassInputRef, 'SUBMIT');
    }
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={regHandler}>
        <Input
          ref={emailInputRef}
          id="userName"
          label="Your email"
          input={{
            type: "text",
            name: "userName",
            placeholder: 'Enter email'
          }}
          onChange={emailChangeHandler}
          isValid={emailState.isValid}
          errorMsg={'Invalid email'}
          onBlur={emailOnBlur}
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
            placeholder: "******"
          }}
          onChange={passwordChangeHandler}
          isValid={passwordState.isValid}
          errorMsg={'Password shoud be great then 5 symbols'}
          onBlur={passwordOnBlur}
          customClasses={classes.row}
        />
        <Input
          ref={checkPassInputRef}
          id="repeatPassword"
          label="Please repeat your password"
          input={{
            type: "password",
            name: "repeatPassword",
            placeholder: "******"
          }}
          onChange={checkPassChangeHandler}
          isValid={passIsEqual && checkPassState.isValid}
          errorMsg={passIsEqual ? 'Password shoud be great then 5 symbols' : 'The passwords should be match'}
          onBlur={checkPassOnBlur}
          customClasses={classes.row}
        />
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <Button
            btnText="Send"
            btn={{
              type: "submit",
              id: "submitReg",
              name: "submitReg",
              value: "1"
            }}
          />
        </div>
      </form>
    </Card>
  );
}

export default RegForm;