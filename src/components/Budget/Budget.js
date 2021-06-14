import React, { useState, useEffect, useContext, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Card from '../UI/Card/Card';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import BudgetTable from './BudgetTable';
import { fetchBudgetList } from '../../store/budgetActions';
import APIContext from '../../store/api-context';
import AuthContext from '../../store/auth-context';
import ModalContext from '../../store/modal-context';
import useHttp from '../../hooks/use-http';
import Button from '../UI/Button/Button';
import Select from '../UI/Select/Select';
import Input from '../UI/Input/Input';

import classes from './Budget.module.scss';
import cardClasses from '../UI/Card/Card.module.scss';

function currentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.length < 2 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
  const day = today.getDate().toString().length < 2 ? `0${today.getDate()}` : today.getDate();

  const h = today.getHours().toString.length < 2 ? `0${today.getHours()}` : today.getHours;
  const m = today.getMinutes().toString.length < 2 ? `0${today.getMinutes()}` : today.getMinutes;
  const s = today.getSeconds().toString.length < 2 ? `0${today.getSeconds()}` : today.getSeconds();

  return {
    year: +year,
    month: +month,
    day: +day,
    h: +h,
    m: +m,
    s: +s,
    dataTime: `${year}-${month}-${day} ${h}:${m}:${s}`,
    data: `${year}-${month}-${day}`,
    time: `${h}:${m}:${s}`,
    yearMonth: `${year}-${month}`,
  }
}

function getYearMonth(date) {
  if (!date) return;
  const arr = date.split('-');
  arr.pop();
  return arr.join('-');
}

function Budget() {
  const dispatch = useDispatch();
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const [isExpand, setIsExpand] = useState(false);

  const [category, setCategory] = useState('all');

  const [month, setMonth] = useState(currentDate().yearMonth);

  const [categoryType, setCategoryType] = useState('all')

  const expenseCategory = useSelector((state) => state.category.expense);
  const incomeCategory = useSelector((state) => state.category.income);
  const [categoryList, setCategoryList] = useState(expenseCategory.concat(incomeCategory));

  const categoryTypeHandler = useCallback((e) => {
    if (e && e.target && e.target.value) setCategoryType(e.target.value);
    const allCategory = [...new Set(expenseCategory.concat(incomeCategory))];
    switch(categoryType) {
      case 'all':
        setCategoryList(allCategory);
        break;
      case 'expense':
        setCategoryList(expenseCategory);
        break;
      case 'income':
        setCategoryList(incomeCategory);
        break;
      default:
        setCategoryList(allCategory);
    }
  }, [expenseCategory, incomeCategory, categoryType]);

  useEffect(() => {
    categoryTypeHandler();
  }, [categoryTypeHandler, expenseCategory, incomeCategory]);

  const incomeItemList = useSelector((state) => state.budget.itemList);
  //const itemList = (incomeItemList && incomeItemList.length) ? incomeItemList.slice().reverse()  : [];
  const [filteredItemList, setFilteredItemList] = useState([]);

  const itemsLoading = useSelector((state) => state.budget.isLoading);
  const { isLoading: isDeleting, sendRequest: fetchItem } = useHttp();

  const { email } = ctxAuth;
  const { host } = ctxAPI;

  useEffect(() => {
    dispatch(fetchBudgetList(host, email));
  }, [dispatch, host, email]);

  function expandTable() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  function removeItem(id) {
    fetchItem(
      {
        url: `${host}/api/budget.php/`,
        method: 'DELETE',
        body: {
          email,
          id,
        },
      },
      (data) => {
        if (data.code !== 0) {
          ctxModal.onShown(
            <Fragment>
              <p>Saving error.</p>
              <p>{data.errorMsg}</p>
              <Button btnText='OK' onClick={ctxModal.onClose} />
            </Fragment>
          );
        } else {
          dispatch(fetchBudgetList(host, email));
        }
      }
    );
  }

  function categoryHandler(e) {
    setCategory(e.target.value);
  }

  function monthHandler(e) {
    setMonth(e.target.value);
  }

  useEffect(() => {
    setFilteredItemList(
      incomeItemList.filter((item) => {
        const categoryTypeFilter = categoryType === 'all' || categoryType === item.category_type;
        const categoryFilter = category === 'all' || category === item.category;
        const dateFilter = month === getYearMonth(item.date);
        
        return categoryTypeFilter && categoryFilter && dateFilter;
      }).reverse()
    );
  }, [categoryType,  category, month, incomeItemList]);

  return (
    <Card className={cardClasses['card--mb']}>
      <ExpandBlock
        isExpand={isExpand}
        expandTarget={expandTable}
        btnText='Expense/Income table'
      />
      <div className={`${classes.block} ${isExpand ? 'shown' : 'hidden'}`}>
        <form className={classes.form}>
          <Select
            name='categoryType'
            id='categoryType'
            label='Type'
            option={['all', 'expense', 'income']}
            customClasses={classes.row}
            value={categoryType}
            onChange={categoryTypeHandler}
          />
          <Select
            name='category'
            id='category'
            label='Category'
            option={categoryList}
            customClasses={classes.row}
            value={category}
            onChange={categoryHandler}
            onBlur={categoryHandler}
          />
          <Input
            input={{
              type: 'month',
              name: 'filterMonth',
              id: 'filterMonth',
            }}
            label='Month'
            value={month}
            onChange={monthHandler}
            onBlur={monthHandler}
          />
        </form>
        <BudgetTable
          itemList={filteredItemList}
          removeItem={removeItem}
          isLoading={isDeleting || itemsLoading}
        />
      </div>
    </Card>
  );
}

export default Budget;
