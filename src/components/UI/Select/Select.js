import React from "react";
import { v4 as uuidv4 } from "uuid";

import classes from './Select.module.scss';

const Select = React.forwardRef((props, ref) => {
  return (
    <div className={`${classes.select} ${props.customClasses ? props.customClasses : ''}`}>
      <label htmlFor={props.id}>{props.label}</label>
      <select
        {...props.select}
        ref={ref}
        id={props.id}
        onChange={props.onChange}
        value={props.value}
        defaultValue={props.defaultValue}
      >
        {props.option && props.option.map((option) => {
          const id = `${option}-${uuidv4()}`;
          return (
            <option key={id} value={option}>{option}</option>
          );
        })}
    </select>
    </div>
  );
});

export default Select;