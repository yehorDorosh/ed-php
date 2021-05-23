import React, { useState, useEffect } from 'react';

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';

import classes from './CategoryForm.module.scss';

function CategoryForm(props) {
  const [categoryType, setCategoryType] = useState('expense');

  const { liftUpCategoryType } = props;

  useEffect(() => {
    liftUpCategoryType(categoryType);
  }, [categoryType, liftUpCategoryType]);

  function categoryTypeHandler(e) {
    setCategoryType(e.target.value);
  }

  return (
    <form className={classes.form}>
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
      <Input label="New actegory name" customClasses={classes.row}/>
      <div className={`${classes["btn-row"]} ${classes.row}`}>
        <Button btnText="Add new category" />
      </div>
    </form>
  );
}

export default CategoryForm;