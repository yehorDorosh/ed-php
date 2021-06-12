import classes from './ExpandBlock.module.scss';

function ExpandBlock(props) {
  return (
    <div>
      <button
        className={`${classes.btn} ${
          props.isExpand ? classes.expanded : classes.collapsed
        }`}
        type="button"
        onClick={props.expandTarget}
      >
        {props.btnText}
      </button>
    </div>
  );
}

export default ExpandBlock;