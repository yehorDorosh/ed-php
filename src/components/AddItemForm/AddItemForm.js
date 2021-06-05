import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import Card from '../UI/Card/Card';
import Select from '../UI/Select/Select';

import classes from './AddItemForm.module.scss';
import cardClasses from '../UI/Card/Card.module.scss';

function AddItemForm() {
  const [isExpand, setIsExpand] = useState(false);
  const [categoryType, setCategoryType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const category = useSelector((state) => state.category[categoryType]);

  function expandForm() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  function categoryTypeHandler(e) {
    setCategoryType(e.target.value);
  }

  function categoryHandler(e) {
    setSelectedCategory(e.target.value);
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
        <div className={`${classes.row}`}>
          <Select
            name='category'
            id='categorySelect'
            label='Choose category'
            option={category}
            onChange={categoryHandler}
            value={selectedCategory}
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