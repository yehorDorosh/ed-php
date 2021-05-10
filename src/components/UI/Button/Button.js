import classes from "./Button.module.scss";

const Button = (props) => {
  return (
    <button className={classes.btn} {...props.btn}>
      {props.btnText}
    </button>
  );
};

export default Button;
