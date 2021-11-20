//import { Fragment } from "react";

import Input from '../UI/Input/Input';
import useInput from '../../hooks/use-input';
import Select from '../UI/Select/Select';

import classes from './ImportFormRow.module.scss';

const ImportFormRow = (props) => {
  const { categories, data, comDate } = props;
  const { name: nameImported, amount: amountImported } = data;

  const {
    value: category,
    valueChangeHandler: categoryChangeHandler,
    inputBlurHandler: categoryBlurHandler,
  } = useInput((category) => categories.includes(category), 'all');
  const {
    value: name,
    //isValid: nameIsValid,
    hasError: nameError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    //reset: clearName
  } = useInput((name) => !!name, nameImported);
  const {
    value: amount,
    //isValid: amountIsValid,
    hasError: amountError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    //reset: clearAmount
  } = useInput((amount) => !!+amount, amountImported);
  const {
    value: date,
    //isValid: dateIsValid,
    hasError: dateError,
    valueChangeHandler: dateChangeHandler,
    inputBlurHandler: dateBlurHandler,
    //reset: clearDate
  } = useInput((date) => !!date, comDate);

  return (
    <div
      className={classes.row} data-role='imported-row'
      data-name={name}
      data-amount={amount}
      data-date={date}
      data-category={category}
    >
      <Input
        input={{
            type: 'text',
            name: 'itemName',
        }}
        label="Item name"
        customClasses={classes.item}
        onChange={nameChangeHandler}
        onBlur={nameBlurHandler}
        isValid={!nameError}
        errorMsg={"Item name can't be empty"}
        value={name}
      />
      <Input
        input={{
          type: 'number',
          name: 'itemAmount',
          min: 0,
          max: 999999999,
          step: '.01',
          placeholder: '0.00€'
        }}
        label="Item amount"
        customClasses={classes.item}
        onChange={amountChangeHandler}
        onBlur={amountBlurHandler}
        isValid={!amountError}
        errorMsg={"Item amount can't be empty or zero"}
        value={amount}
      />
      <Input
        input={{
          type: 'date',
          name: 'itemDate',
        }}
        label="Date"
        customClasses={classes.item}
        onChange={dateChangeHandler}
        onBlur={dateBlurHandler}
        isValid={!dateError}
        errorMsg={"Date can't be empty"}
        value={date}
      />
      <Select
        select={{
          name: 'itemCategory',
        }}
        //id='categorySelect'
        label='Choose category'
        option={categories}
        value={category}
        customClasses={classes.item}
        onChange={categoryChangeHandler}
        onBlur={categoryBlurHandler}
      />
    </div>
  );
}

export default ImportFormRow;