import React, { useState, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux'

import Card from '../UI/Card/Card';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import BudgetTable from './BudgetTable';
import { fetchBudgetList } from '../../store/budgetActions';
import APIContext from '../../store/api-context';
import AuthContext from '../../store/auth-context';

import classes from './Budget.module.scss';
import cardClasses from '../UI/Card/Card.module.scss';

function Budget() {
  const dispatch = useDispatch();
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);

  const [isExpand, setIsExpand] = useState(false);

  function expandTable() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  const { email } = ctxAuth;
  const { host } = ctxAPI;

  useEffect(() => {
    dispatch(fetchBudgetList(host, email));
  }, [dispatch, host, email]);

  return (
    <Card className={cardClasses['card--mb']}>
      <ExpandBlock isExpand={isExpand} expandTarget={expandTable} btnText='Expense/Income table' />
      <div className={`${classes.block} ${isExpand ? 'shown' :'hidden'}`}>
        <BudgetTable />
      </div>
    </Card>
  );
}

export default Budget;