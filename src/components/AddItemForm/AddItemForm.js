import React, { useState } from 'react';

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';
import Select from '../UI/Select/Select';

import classes from './AddItemForm.module.scss';
import cardClasses from '../UI/Card/Card.module.scss';

function AddItemForm() {
  const [isExpand, setIsExpand] = useState(false);

  function expandForm() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  return (
    <Card className={cardClasses['card--mb']}>
      <div>
        <button
          className={`${classes.btn} ${
            isExpand ? classes.expanded : classes.collapsed
          }`}
          type="button"
          onClick={expandForm}
        >
          Add Expense/Income
        </button>
      </div>
      <form className={`${classes.form} ${isExpand ? 'shown' :'hidden'}`}>
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
            customClasses={classes.radio}
          />
        </div>
        <div className={`${classes.row}`}>
          <Select
            id='category'
            label='Choose category'
          />
        </div>
        <div className={`${classes.row}`}>
        <Input
          label="Item name"
          customClasses={classes.row}
          errorMsg={"Category name can't be empty"}
        />
        </div>
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <Button btnText="Add item" />
        </div>
      </form>
    </Card>
  );
}

export default AddItemForm;