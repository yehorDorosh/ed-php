import classes from './Wrapper.module.scss';

function Wrapper(props) {
  return (
    <div className={`${classes.wrap} ${props.className}`}>
      {props.children}
    </div>
  );
}

export default Wrapper;