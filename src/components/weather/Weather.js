import { useContext, useState } from 'react';
import { v4 as uuidv4 } from "uuid";

import useHttp from "../../hooks/use-http";
import APIContext from "../../store/api-context";
import Card from '../UI/Card/Card';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
//import ModalContext from "../../store/modal-context";

import classes from "./Weather.module.scss";
import cardClasses from '../UI/Card/Card.module.scss';

function localDateFormat(strDate) {
  const date = new Date(`${strDate} UTC`);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.length < 2 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate().toString().length < 2 ? `0${date.getDate()}` : date.getDate();

  const h = date.getHours().toString().length < 2 ? `0${date.getHours()}` : date.getHours();
  const m = date.getMinutes().toString().length < 2 ? `0${date.getMinutes()}` : date.getMinutes();
  const s = date.getSeconds().toString().length < 2 ? `0${date.getSeconds()}` : date.getSeconds();

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

const LastWeather = () => {
  const ctxAPI = useContext(APIContext);
  const [isExpand, setIsExpand] = useState(false);
  //const ctxModal = useContext(ModalContext);

  const [date, setDate] = useState(currentDate().date);

  function expandWeatherBlock() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  const { isLoading, sendRequest: getWeather } = useHttp();
  const { host } = ctxAPI;
  //const { onShown: showErrorPopup, onClose: closeErrorPopup } = ctxModal;

  const [weather, setWeather] = useState([]);

  function makeWeatherRequest(e) {
    e.preventDefault();
  
    getWeather(
      {
        url: `${host}/api/weather.php?id=1&date=${date}`,
      },
      (response) => {
        setWeather(response.data);
      }
    );
  }

  function dayHandler(e) {
    setDate(e.target.value);
  }

  return (
    <Card className={cardClasses['card--mb']}>
    <ExpandBlock isExpand={isExpand} expandTarget={expandWeatherBlock} btnText='Weather Log' />
      <div className={`${classes["weather"]} ${isExpand ? 'shown' : 'hidden'}`}>
        <form className={classes.form} onSubmit={makeWeatherRequest}>
          <Input
            input={{
              type: 'date',
              name: 'filterDay',
              id: 'filterDay',
            }}
            label='Day'
            value={date}
            onChange={dayHandler}
            onBlur={dayHandler}
          />
          <div className={`${classes.row}`}>
            <Button btnText="Get data" />
          </div>
        </form>
      {weather && (
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Temperature, °C</th>
              <th>Pressure, Pa</th>
              <th>Altitude, m</th>
              <th>Date Time</th>
            </tr>
            {weather.map((row) => {
              return (
                <tr key={`${row.id}-${uuidv4()}`}>
                  <td>{row.id}</td>
                  <td>{row.t} °C</td>
                  <td>{row.p} Pa</td>
                  <td>{row.a} m</td>
                  <td>{localDateFormat(row.reg_date).dateTime}</td>
                </tr>
              );
            })}
            </tbody>
        </table>
      )}
      { !weather.length && <p>No weather data</p>}
      {isLoading && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
      </div>
    </Card>
  );
}

export default LastWeather;