import React, { Fragment } from 'react';

import Button from '../UI/Button/Button';

import classes from './BudgetTable.module.scss';
import classesButton from '../UI/Button/Button.module.scss';

function BudgetTable(props) {
  function removeItem(id) {
    props.removeItem(id);
  }

  return (
    <Fragment>
      {props.itemList.length > 0 && (
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.itemList.map((row) => {
              return (
                <tr key={row.id}>
                  <td>{row.category_type}</td>
                  <td>{row.category}</td>
                  <td>{row.name}</td>
                  <td>{row.amount}</td>
                  <td>{row.date}</td>
                  <td>
                    <Button
                      btnText='Delete'
                      onClick={removeItem.bind(null, row.id)}
                      className={classesButton['btn--red']}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {!props.itemList.lenght && (
        <p className={classes['text-center']}>
          No results. Try another filter setup.
        </p>
      )}
      {props.isLoading && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
    </Fragment>
  );
}

export default BudgetTable;