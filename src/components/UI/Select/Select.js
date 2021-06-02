import React from "react";

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
      >
        {props.option && props.option.map((option) => {
          return (
            <option selected={`${option === 'all' && 'selected'}`}>{option}</option>
          );
        })}
    </select>
    </div>
  );
});

export default Select;