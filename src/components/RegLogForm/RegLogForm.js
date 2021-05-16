import React, { useState } from 'react';

import RegForm from './RegForm';
import LoginForm from './LoginForm';
import Button from '../UI/Button/Button';

function RegLogForm() {
  const [showRegistration, setShowRegistration] = useState(false);

  function swithForm() {
    showRegistration ? setShowRegistration(false) : setShowRegistration(true);
  }

  return (
    <div>
      <div>
        <Button
          btnText="Sign up"
          onClick={swithForm}
        />
        <span>|</span>
        <Button
          btnText="Registration"
          onClick={swithForm}
        />
      </div>
      <div>
        {showRegistration ? <RegForm /> : <LoginForm />}
      </div>
    </div>
  );
}

export default RegLogForm;
