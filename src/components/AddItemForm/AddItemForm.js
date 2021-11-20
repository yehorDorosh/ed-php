import React, { useState, useContext, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';
import Select from '../UI/Select/Select';
import useInput from '../../hooks/use-input';
import APIContext from '../../store/api-context';
import AuthContext from '../../store/auth-context';
import ModalContext from '../../store/modal-context';
import useHttp from '../../hooks/use-http';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import { fetchBudgetList } from '../../store/budgetActions';
import ImportForm from './ImportForm';

import classes from './AddItemForm.module.scss';
import cardClasses from '../UI/Card/Card.module.scss';

function currentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.length < 2 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
  const day = today.getDate().toString().length < 2 ? `0${today.getDate()}` : today.getDate();

  return `${year}-${month}-${day}`
}

function currentTime() {
  const today = new Date();
  const h = today.getHours().toString.length < 2 ? `0${today.getHours()}` : today.getHours;
  const m = today.getMinutes().toString.length < 2 ? `0${today.getMinutes()}` : today.getMinutes;
  const s = today.getSeconds().toString.length < 2 ? `0${today.getSeconds()}` : today.getSeconds();

  return `${h}:${m}:${s}`;
}

function AddItemForm() {
  const dispatch = useDispatch();
  const [isExpand, setIsExpand] = useState(false);
  const [categoryType, setCategoryType] = useState('expense');

  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const categories = useSelector((state) => state.category[categoryType]);

  const {
    value: category,
    isValid: categoryIsValid,
    valueChangeHandler: categoryChangeHandler,
    inputBlurHandler: categoryBlurHandler,
  } = useInput((category) => categories.includes(category), 'all');
  const {
    value: name,
    isValid: nameIsValid,
    hasError: nameError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: clearName
  } = useInput((name) => !!name);
  const {
    value: amount,
    isValid: amountIsValid,
    hasError: amountError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    reset: clearAmount
  } = useInput((amount) => !!+amount);
  const {
    value: date,
    isValid: dateIsValid,
    hasError: dateError,
    valueChangeHandler: dateChangeHandler,
    inputBlurHandler: dateBlurHandler,
    //reset: clearDate
  } = useInput((date) => !!date, currentDate());

  const { email } = ctxAuth;
  const { host } = ctxAPI;

  const { isLoading, sendRequest: fetchItem} = useHttp();


  function expandForm() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  function categoryTypeHandler(e) {
    setCategoryType(e.target.value);
  }

  function addItem() {
    fetchItem(
      {
        url: `${host}/api/budget.php/`,
        method: 'POST',
        body: {
          id: `${email}-${category}-${name}-${uuidv4()}`,
          email,
          logDate: `${currentDate()} ${currentTime()}`,
          date,
          categoryType,
          category,
          name,
          amount
        }
      },
      (data) => {
        if (data.code !== 0) {
          ctxModal.onShown(
            <Fragment>
              <p>Saving error.</p>
              <p>{data.errorMsg}</p>
              <Button btnText="OK" onClick={ctxModal.onClose} />
            </Fragment>
          );
        } else {
          dispatch(fetchBudgetList(host, email));
        }
      }
    );
  }

  function submitDataHandler(e) {
    e.preventDefault();
    if (
      (categoryType === 'expense' || categoryType === 'income') &&
      categoryIsValid &&
      nameIsValid &&
      amountIsValid &&
      dateIsValid &&
      email
    ) {
      addItem();
      clearName();
      clearAmount();
    } else {
      nameBlurHandler();
      amountBlurHandler();
      dateBlurHandler();
    }
  }

  return (
    <Card className={cardClasses['card--mb']}>
      <ExpandBlock isExpand={isExpand} expandTarget={expandForm} btnText='Add Expense/Income' />
      <form
        onSubmit={submitDataHandler}
        className={`${classes.form} ${isExpand ? 'shown' :'hidden'}`}
      >
        <div className={`${classes.row} ${classes['category-select']}`}>
          <Input
            id="addCategoryTypeExpense"
            label="Expenses"
            input={{
              type: "radio",
              name: "categoryType",
              defaultChecked: "true"
            }}
            value="expense"
            customClasses={classes.radio}
            onClick={categoryTypeHandler}
          />
          <Input
            id="addCategoryTypeIncome"
            label="Income"
            input={{
              type: "radio",
              name: "categoryType",
            }}
            value="income"
            customClasses={classes.radio}
            onClick={categoryTypeHandler}
          />
        </div>
        <Select
          name='category'
          id='categorySelect'
          label='Choose category'
          option={categories}
          value={category}
          customClasses={classes.row}
          onChange={categoryChangeHandler}
          onBlur={categoryBlurHandler}
        />
        <Input
          input={{
              type: 'text',
              name: 'itemName',
          }}
          label="Item name"
          customClasses={classes.row}
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
          customClasses={classes.row}
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
          customClasses={classes.row}
          onChange={dateChangeHandler}
          onBlur={dateBlurHandler}
          isValid={!dateError}
          errorMsg={"Date can't be empty"}
          value={date}
        />
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <Button btnText="Add item" />
        </div>
        {isLoading && (
          <div className={classes.load}>
            <div className={classes.loader}></div>
          </div>
        )}
      </form>
      <div>
        <ImportForm />
      </div>
    </Card>
  );
}

export default AddItemForm;