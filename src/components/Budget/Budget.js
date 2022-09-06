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
import CategoryStatistics from './CategoryStatistics';

import classes from './Budget.module.scss';
import cardClasses from '../UI/Card/Card.module.scss';

function currentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.length < 2 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
  const day = today.getDate().toString().length < 2 ? `0${today.getDate()}` : today.getDate();

  const h = today.getHours().toString().length < 2 ? `0${today.getHours()}` : today.getHours();
  const m = today.getMinutes().toString().length < 2 ? `0${today.getMinutes()}` : today.getMinutes();
  const s = today.getSeconds().toString().length < 2 ? `0${today.getSeconds()}` : today.getSeconds();

  return {
    year: +year,
    month: +month,
    day: +day,
    h: +h,
    m: +m,
    s: +s,
    dateTime: `${year}-${month}-${day} ${h}:${m}:${s}`,
    date: `${year}-${month}-${day}`,
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

function moveToMonth(prev, step) {
  const prevDate = new Date(`${prev}-01T12:00:00`);
  const newDate = new Date(prevDate.setMonth(prevDate.getMonth() + step));
  const dateArr = newDate.toISOString().split('T')[0].split('-');
  dateArr.pop();
  return dateArr.join('-');
}

function Budget() {
  const dispatch = useDispatch();
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const [isExpand, setIsExpand] = useState(false);

  const [category, setCategory] = useState('all');

  const [filterPeriod, setFilterPeriod] = useState('month');
  const [month, setMonth] = useState(currentDate().yearMonth);
  const [year, setYear] = useState(currentDate().year);

  const [categoryType, setCategoryType] = useState('all');

  const expenseCategory = useSelector((state) => state.category.expense);
  const incomeCategory = useSelector((state) => state.category.income);
  const [categoryList, setCategoryList] = useState(expenseCategory.concat(incomeCategory));

  const [nameFilter, setNameFilter] = useState('');

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
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [balance, setBalance] = useState(0);

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

  function filterPeriodHandler(e) {
    setFilterPeriod(e.target.value);
  }

  function monthHandler(e) {
    setMonth(e.target.value);
  }

  function yearHandler(e) {
    setYear(+e.target.value);
  }

  function nameFilterHandler(e) {
    setNameFilter(e.target.value);
  }

  useEffect(() => {
    const shownItems = incomeItemList.filter((item) => {
      const categoryTypeFilter = categoryType === 'all' || categoryType === item.category_type;
      const categoryFilter = category === 'all' || category === item.category;
      const regExp = new RegExp(nameFilter, 'igm');
      const dateFilter = ((filterPeriod === 'month' && month === getYearMonth(item.date)) ||
        (filterPeriod === 'year' && year === new Date(item.date).getFullYear())) &&
        (nameFilter === '' ? true : regExp.test(item.name));
      
      return showAll || (categoryTypeFilter && categoryFilter && dateFilter);
    }).reverse();

    setTotalExpenses(
      shownItems.reduce((accumulator, current) => {
        if(current.category_type === 'expense') {
          return accumulator + +current.amount;
        } else {
          return accumulator;
        }
      }, 0)
    );

    setTotalIncome(
      shownItems.reduce((accumulator, current) => {
        if(current.category_type === 'income') {
          return accumulator + +current.amount;
        } else {
          return accumulator;
        }
      }, 0)
    );

    setBalance(totalIncome - totalExpenses);

    setFilteredItemList(shownItems);
  }, [categoryType,  category, filterPeriod, month, year, nameFilter, incomeItemList, showAll, totalExpenses, totalIncome]);

  function periodBack() {
    if (filterPeriod === 'month') {
      setMonth((prev) => moveToMonth(prev, -1));
    } else if (filterPeriod === 'year') {
      setYear((prev) => prev - 1);
    }
  }

  function periodForward() {
    if (filterPeriod === 'month') {
      setMonth((prev) => moveToMonth(prev, 1));
    } else if (filterPeriod === 'year') {
      setYear((prev) => prev + 1);
    }
  }

  function showAllHandler() {
    setShowAll((prev) => !prev);
  }

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
          <Select
            name='filterPeriod'
            id='filterPeriod'
            label='Filter period'
            option={['month', 'year']}
            customClasses={classes.row}
            value={filterPeriod}
            onChange={filterPeriodHandler}
            onBlur={filterPeriodHandler}
          />
          <div className={classes.row}>
            { filterPeriod === 'month' && (
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
            )}
            { filterPeriod === 'year' && (
              <Input
                input={{
                  type: 'number',
                  name: 'filterYear',
                  id: 'filterYear',
                  step: 1
                }}
                label='Year'
                value={year}
                onChange={yearHandler}
                onBlur={yearHandler}
              />
            )}
          </div>
          <div className={classes.row}>
            <Input
              input={{
                type: 'text',
                name: 'filterName',
                id: 'filterName',
              }}
              label='Filter name'
              value={nameFilter}
              onChange={nameFilterHandler}
              onBlur={nameFilterHandler}
            />
          </div>
          <div className={`${classes['btn-row']} ${classes.row}`}>
            <Button
              btn={{
                type: 'button',
              }}
              btnText={`One ${filterPeriod} back`}
              onClick={periodBack}
            />
            <Button
              btn={{
                type: 'button',
              }}
              btnText={`One ${filterPeriod} forward`}
              onClick={periodForward}
            />
          </div>
          <div className={`${classes.row}`}>
            <Button
                btn={{
                  type: 'button',
                }}
                btnText={showAll ? 'Enable filter' : 'Show all'} 
                onClick={showAllHandler}
              />
          </div>
        </form>
        <div className={classes.statistics}>
          <div>
            <p>Total statistics</p>
            <ul>
              <li>Total epxenses: {totalExpenses.toFixed(2)}</li>
              <li>Total income: {totalIncome.toFixed(2)}</li>
              <li>Balance: {balance.toFixed(2)}</li>
            </ul>
          </div>
          <CategoryStatistics categoryList={categoryList} itemList={filteredItemList} />
        </div>
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
