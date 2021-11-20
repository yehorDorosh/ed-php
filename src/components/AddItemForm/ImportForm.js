import React, { useState, useContext, Fragment, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from "uuid";

import Input from '../UI/Input/Input';
import useInput from '../../hooks/use-input';
import Button from '../UI/Button/Button';
import APIContext from '../../store/api-context';
import AuthContext from '../../store/auth-context';
import ModalContext from '../../store/modal-context';
import useHttp from '../../hooks/use-http';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import { fetchBudgetList } from '../../store/budgetActions';

import classes from './ImportForm.module.scss';
import ImportFormRow from './ImportFormRow';

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

function ImportForm() {
  const dispatch = useDispatch();
  const [isExpand, setIsExpand] = useState(false);
  const [importData, setImportData] = useState();
  const textArea = useRef();

  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const categories = useSelector((state) => state.category['expense']);

  const { email } = ctxAuth;
  const { host } = ctxAPI;

  const { isLoading, sendRequest: fetchItem} = useHttp();

  const {
    value: date,
    hasError: dateError,
    valueChangeHandler: dateChangeHandler,
    inputBlurHandler: dateBlurHandler,
    //reset: clearDate
  } = useInput((date) => !!date, currentDate());


  function expandForm() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  function addItem(name, amount, category, date, categoryType) {
    fetchItem(
      {
        url: `${host}/api/budget.php/`,
        method: 'POST',
        body: {
          id: `${email}-${category}-${name}-${uuidv4()}`,
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

  function sendDataArr(sendData) {
    sendData.forEach(data => {
      addItem(data.name, data.amount, data.category, data.date, 'expense');
    });
    textArea.current.value = '';
    setImportData([]);
  }

  function submitDataHandler(e) {
    e.preventDefault();
    const sendData = [];
    const listImportedRows = document.querySelectorAll('[data-role="imported-row"]');
    if (!listImportedRows.length) return;
    listImportedRows.forEach(row => {
      const name = row.dataset.name;
      const amount = row.dataset.amount;
      const date = row.dataset.date;
      const category = row.dataset.category;

      if (!name || !amount || !date || !category) return;

      const dataRow = {
        name,
        amount,
        date,
        category
      };

      sendData.push(dataRow);
    });

    if (!sendData.length) return;
    sendDataArr(sendData);
  }

  function formatData(e) {
    let inputData = e.target.value;
    let data = [];
    if (!inputData) return;

    inputData = inputData.replaceAll('₽', '');
    data = inputData.split('\n');
    if (data.length) data = data.map(item => item.split('\t'));

    data = data.map((row, i) => {
      if (row.length <= 1) return null;
  
      return {
        name: row[0],
        amount: +row[1].trim().replaceAll(',', '.'),
      };
    });
    data = data.filter(row => row);
    setImportData(data);
  }

  return (
    <Fragment>
      <ExpandBlock isExpand={isExpand} expandTarget={expandForm} btnText='Import data' />
      <form
        onSubmit={submitDataHandler}
        className={`${classes.form} ${isExpand ? 'shown' :'hidden'}`}
      >
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <textarea ref={textArea} onChange={formatData}></textarea>
        </div>
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <Input
            input={{
              type: 'date',
              name: 'itemDate',
            }}
            label="Date for all items"
            customClasses={classes.row}
            onChange={dateChangeHandler}
            onBlur={dateBlurHandler}
            isValid={!dateError}
            errorMsg={"Date can't be empty"}
            value={date}
          />
        </div>
        <div>
          {importData && importData.map((row) => (
            <ImportFormRow key={uuidv4()} data={row} categories={categories} comDate={date} />
          ))}
        </div>
        <div className={`${classes["btn-row"]} ${classes.row}`}>
          <Button btnText="Send data" />
        </div>
        {isLoading && (
          <div className={classes.load}>
            <div className={classes.loader}></div>
          </div>
        )}
      </form>
    </Fragment>
  );
}

export default ImportForm;