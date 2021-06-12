import React, { useState } from 'react';

import Card from '../UI/Card/Card';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';

import classes from './Budget.module.scss';
import cardClasses from '../UI/Card/Card.module.scss';


function BudgetTable() {
  const [isExpand, setIsExpand] = useState(false);

  function expandTable() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  return (
    <Card className={cardClasses['card--mb']}>
      <ExpandBlock isExpand={isExpand} expandTarget={expandTable} btnText='Expense/Income table' />
      <div className={`${isExpand ? 'shown' :'hidden'}`}>
        <table>
            <thead>
              <tr>
                <th>name</th>
                <th>amount</th>
              </tr>
            </thead>
          <tbody>
            <tr>
              <td>fuel</td>
              <td>50</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default BudgetTable;