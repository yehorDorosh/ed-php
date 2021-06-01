import React, { useState, useEffect, useContext, Fragment } from 'react';

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import useInput from '../../hooks/use-input';
import useHttp from '../../hooks/use-http';
import APIContext from '../../store/api-context';
import AuthContext from '../../store/auth-context';
import ModalContext from '../../store/modal-context';

import classes from './CategoryForm.module.scss';

function CategoryForm(props) {
  const [categoryType, setCategoryType] = useState('expense');

  const {
    value: categoryName,
    isValid: categoryNameIsValid,
    hasError: categoryNameError,
    valueChangeHandler: categoryNameChangeHandler,
    inputBlurHandler: categoryNameBlurHandler,
    reset: clearCategoryName
  } = useInput((categoryName) => !!categoryName);
  const { isLoading, sendRequest: sendNewCategory } = useHttp();
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const { liftUpCategoryType } = props;

  useEffect(() => {
    liftUpCategoryType(categoryType);
  }, [categoryType, liftUpCategoryType]);

  function categoryTypeHandler(e) {
    setCategoryType(e.target.value);
  }

  function addCategory(e) {
    e.preventDefault();
    if (categoryNameIsValid) {
      sendNewCategory(
        {
          url: `${ctxAPI.host}/api/category.php/`,
          method: 'POST',
          body: {
            email: ctxAuth.email,
            categoryType,
            categoryName,
          }
        }, (data) => {
          if (data.code === 0) {
            clearCategoryName();
            props.rerender(prevState => !prevState);

          } else if (data.code === 1) {
            ctxModal.onShown(
              <Fragment>
                <p>Unknown category type</p>
                <p>{categoryType}</p>
                <Button btnText="OK" onClick={ctxModal.onClose} />
              </Fragment>
            );
          } else if (data.code === 2) {
            ctxModal.onShown(
              <Fragment>
                <p>Invalid category name or user config table doesn't exist</p>
                <p>{categoryName}, {ctxAuth.email}</p>
                <Button btnText="OK" onClick={ctxModal.onClose} />
              </Fragment>
            );
          }
        }
      );
    } else {
      categoryNameBlurHandler();
    }
  }

  return (
    <form className={classes.form} onSubmit={addCategory}>
      <div className={`${classes.row} ${classes['category-select']}`}>
        <Input
          id="categoryTypeExpense"
          label="Expenses"
          input={{
            type: "radio",
            name: "categoryType",
            defaultChecked: "true"
          }}
          value="expense"
          onClick={categoryTypeHandler}
          customClasses={classes.radio}
        />
        <Input
          id="categoryTypeIncome"
          label="Income"
          input={{
            type: "radio",
            name: "categoryType",
          }}
          value="income"
          onClick={categoryTypeHandler}
          customClasses={classes.radio}
        />
      </div>
      <Input
        label="New actegory name"
        customClasses={classes.row}
        onChange={categoryNameChangeHandler}
        onBlur={categoryNameBlurHandler}
        isValid={!categoryNameError}
        errorMsg={"Category name can't be empty"}
        value={categoryName}
      />
      <div className={`${classes["btn-row"]} ${classes.row}`}>
        <Button btnText="Add new category" />
      </div>
      {isLoading && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
    </form>
  );
}

export default CategoryForm;