import React from 'react';

import Card from '../UI/Card/Card';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';

import classes from './RegForm.module.scss';

function RegForm() {
  function regHandler(e) {
    e.preventDefault();
  }

  return (
    <Card>
      <form className={classes.form} onSubmit={regHandler}>
        <Input
          id="userName"
          label="User name"
          input={{
            type: "text",
            name: "userName"
          }}
          customClasses={classes.row}
        />
        <Input
          id="newPassword"
          label="Enter your password"
          input={{
            type: "text",
            name: "newPassword"
          }}
          customClasses={classes.row}
        />
        <Input
          id="repeatPassword"
          label="Please repeat your password"
          input={{
            type: "text",
            name: "repeatPassword"
          }}
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