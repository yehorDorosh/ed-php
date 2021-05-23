import React from "react";

import classes from "./Input.module.scss";

const Input = React.forwardRef((props, ref) => {
  const errorMsg = props.isValid === false ? (
    <div className={classes.error}>
      <p className={classes.error__text}>{props.errorMsg}</p>
    </div>
  ) : null;
  return (
    <div
      className={`${classes.input} ${props.customClasses} ${
        props.isValid === false ? classes.invalid : ""
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      <input
        {...props.input}
        ref={ref}
        id={props.id}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onClick={props.onClick}
        value={props.value}
      />
      {errorMsg}
    </div>
  );
});

export default Input;
