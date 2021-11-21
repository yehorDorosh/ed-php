import React, { Fragment, useState, useContext, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../UI/Button/Button';
import Select from '../UI/Select/Select';
import APIContext from '../../store/api-context';
import AuthContext from '../../store/auth-context';
import ModalContext from '../../store/modal-context';
import useHttp from '../../hooks/use-http';
import { fetchBudgetList } from '../../store/budgetActions';

import classes from './BudgetTable.module.scss';
import classesButton from '../UI/Button/Button.module.scss';

function currentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.length < 2 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
  const day = today.getDate().toString().length < 2 ? `0${today.getDate()}` : today.getDate();

  return `${year}-${month}-${day}`
}

function currentTime() {
  const today = new Date();
  const h = today.getHours().toString.length < 2 ? `0${today.getHours()}` : today.getHours;
  const m = today.getMinutes().toString.length < 2 ? `0${today.getMinutes()}` : today.getMinutes;
  const s = today.getSeconds().toString.length < 2 ? `0${today.getSeconds()}` : today.getSeconds();

  return `${h}:${m}:${s}`;
}

function BudgetTable(props) {
  const [ editing, setEditing] = useState('');
  const [categoryType, setCategoryType] = useState('expense');

  const dispatch = useDispatch();
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);
  const { email } = ctxAuth;
  const { host } = ctxAPI;
  const categories = useSelector((state) => state.category[categoryType]);
  const nameInput = useRef();
  const amountInput = useRef();
  const categoryInput = useRef();
  const dateInput = useRef();
  const typeInput = useRef();

  const { isLoading, sendRequest: fetchItem} = useHttp();

  function removeItem(id) {
    props.removeItem(id);
  }

  function editRow(id) {
    props.itemList.forEach(row => {
      if(row.id === id) {
        setEditing(id);
        setCategoryType(row.category_type);

        if(editing !== '') {
          const name = nameInput.current.value;
          const amount = amountInput.current.value;
          const category = categoryInput.current.value;
          const date = dateInput.current.value;
          const type = typeInput.current.value;
          if (!name || !amount || !category || !date || !type) return;
          editItem(row.id, name.trim(), amount, category, date, type);
          cancelEdition();
        }
      }
    });
  }

  function cancelEdition() {
    setEditing('');
  }

  function editItem(id, name, amount, category, date, categoryType) {
    fetchItem(
      {
        url: `${host}/api/budget.php/`,
        method: 'PUT',
        body: {
          id,
          email,
          logDate: `${currentDate()} ${currentTime()}`,
          date,
          categoryType,
          category,
          name,
          amount
        }
      },
      (data) => {
        if (data.code !== 0) {
          ctxModal.onShown(
            <Fragment>
              <p>Saving error.</p>
              <p>{data.errorMsg}</p>
              <Button btnText="OK" onClick={ctxModal.onClose} />
            </Fragment>
          );
        } else {
          dispatch(fetchBudgetList(host, email));
        }
      }
    );
  }

  return (
    <Fragment>
      {props.itemList.length > 0 && (
        <div className={classes['table-scroll']}>
          <table className={classes.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Type</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {props.itemList.map((row) => {
                const printItem = editing === '' || row.id !== editing;

                return (
                  <tr key={row.id}>
                    <td>
                      { printItem && (<div>{row.name}</div>)}
                      {row.id === editing && (<div><input ref={nameInput} type='text' defaultValue={row.name} /></div>)}
                    </td>
                    <td>
                      { printItem && (<div>{row.amount}</div>)}
                      {row.id === editing && (
                        <div><input
                          ref={amountInput}
                          type='number'
                          min='0'
                          max='999999999'
                          step='.01'
                          placeholder='0.00€'
                          defaultValue={row.amount}
                        /></div>
                      )}
                    </td>
                    <td>
                      { printItem && (<div>{row.category}</div>)}
                      {row.id === editing && (<div>
                        <Select
                          ref={categoryInput}
                          label=''
                          option={categories}
                          defaultValue={row.category}
                          customClasses={''}
                          onChange={()=>{}}
                          onBlur={()=>{}}
                        />
                      </div>)}
                    </td>
                    <td>
                      { printItem && (<div>{row.date}</div>)}
                        {row.id === editing && (<div><input ref={dateInput} type='date' defaultValue={row.date} /></div>)}
                    </td>
                    <td>
                      { printItem && (<div>{row.category_type}</div>)}
                        {row.id === editing && (<div>
                          <Select
                            ref={typeInput}
                            label=''
                            option={['expense', 'income']}
                            value={categoryType}
                            customClasses={''}
                            onChange={()=>{
                              setCategoryType(prev => {
                                if(prev === 'expense') return 'income';
                                if(prev === 'income') return 'expense';
                              });
                            }}
                            onBlur={()=>{}}
                          />
                        </div>)}
                    </td>
                    <td>
                      <div className={classes['btn-container']}>
                        <Button
                          btnText={row.id === editing ? 'Save' : 'Edit'}
                          onClick={editRow.bind(null, row.id)}
                          className={classesButton['btn']}
                        />
                      </div>
                      {row.id === editing && (
                        <div className={classes['btn-container']}>
                          <Button
                            btnText='Cancel'
                            onClick={cancelEdition}
                            className={classesButton['btn']}
                          />
                        </div>
                      )}
                    </td>
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
          {isLoading && (
            <div className={classes.load}>
              <div className={classes.loader}></div>
            </div>
          )}
        </div>
      )}
      {!props.itemList.length && (
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
