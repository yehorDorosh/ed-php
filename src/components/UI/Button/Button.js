import classes from "./Button.module.scss";

const Button = (props) => {
  return (
    <button className={classes.btn} {...props.btn} onClick={props.onClick}>
      {props.btnText}
    </button>
  );
};

export default Button;
