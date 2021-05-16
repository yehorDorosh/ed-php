import React, { useState } from 'react';

import RegForm from './RegForm';
import LoginForm from './LoginForm';
import Button from '../UI/Button/Button';

import classes from './RegLogForm.module.scss';
import buttonClasses from '../UI/Button/Button.module.scss';

function RegLogForm() {
  const [showRegistration, setShowRegistration] = useState(false);

  function swithForm() {
    showRegistration ? setShowRegistration(false) : setShowRegistration(true);
  }

  const btnClasses = `${buttonClasses['btn--link']} ${classes['reg-from-block__btn']}`;

  return (
    <div className={classes['reg-from-block']}>
      <div className={classes['reg-from-block__btn-row']}>
        <Button
          btnText="Sign up"
          onClick={swithForm}
          className={`${btnClasses} ${showRegistration ? '' : classes.isActive}`}
        />
        <span>|</span>
        <Button
          btnText="Registration"
          onClick={swithForm}
          className={`${btnClasses} ${showRegistration ? classes.isActive : ''}`}
        />
      </div>
      <div className={classes['reg-from-block__form-row']}>
        {showRegistration ? <RegForm /> : <LoginForm />}
      </div>
    </div>
  );
}

export default RegLogForm;
