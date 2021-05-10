import classes from "./Input.module.scss";

const Input = (props) => {
  return (
    <div className={`${classes.input} ${props.customClasses}`}>
      <label htmlFor={props.id}>{props.label}</label>
      <input {...props.input} />
    </div>
  );
}

export default Input;