import classes from './Card.module.scss';

function Card(props) {
  return (
    <div className={`${classes.card} ${props.customClasses}`}>
      {props.children}
    </div>
  );
}

export default Card;