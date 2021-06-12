import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import classes from './BudgetTable.module.scss';

function BudgetTable() {
  const itemList = useSelector((state) => state.budget.itemList);

  return (
    <Fragment>
      {itemList && (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {itemList.map((row) => {
              return (
                <tr key={row.id}>
                  <td>{row.category_type}</td>
                  <td>{row.category}</td>
                  <td>{row.name}</td>
                  <td>{row.amount}</td>
                  <td>{row.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Fragment>
  );
}

export default BudgetTable;