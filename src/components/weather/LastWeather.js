import { useContext, useEffect, useState } from 'react';

import useHttp from "../../hooks/use-http";
import useAprox from '../../hooks/use-aprox';
import APIContext from "../../store/api-context";
import Card from '../UI/Card/Card';
//import ModalContext from "../../store/modal-context";

import classes from "./LastWeather.module.scss";
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

function dateFormat(Date) {
  const year = Date.getFullYear();
  const month = `${Date.getMonth() + 1}`.length < 2 ? `0${Date.getMonth() + 1}` : Date.getMonth() + 1;
  const day = Date.getDate().toString().length < 2 ? `0${Date.getDate()}` : Date.getDate();

  const h = Date.getHours().toString().length < 2 ? `0${Date.getHours()}` : Date.getHours();
  const m = Date.getMinutes().toString().length < 2 ? `0${Date.getMinutes()}` : Date.getMinutes();
  const s = Date.getSeconds().toString().length < 2 ? `0${Date.getSeconds()}` : Date.getSeconds();

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

// Liner interpolation https://www.trysmudford.com/blog/linear-interpolation-functions/
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

function getDateBeforeOnHours(h) {
  const today = new Date();
  today.setHours(today.getHours() - h);
  return dateFormat(today);
}

const LastWeather = (props) => {
  //console.log(currentDate().dateTime);
  const ctxAPI = useContext(APIContext);
  //const ctxModal = useContext(ModalContext);

  const { isLoading, sendRequest: getWeather } = useHttp();
  const {aprox: pressureAprox} = useAprox();
  const { host } = ctxAPI;
  //const { onShown: showErrorPopup, onClose: closeErrorPopup } = ctxModal;

  const [lastWeather, setLastWeather] = useState();
  const [pressureDiff, setPressureDiff] = useState();

  useEffect(() => {
    function getPressureDrop(data) {
      if (!data.length) return null;
      const pressureLog = data.map(row => row.p);
      const coefficients = pressureAprox(pressureLog);
  
      const y0 = coefficients.a * 1 + coefficients.b;
      const y1 = coefficients.a * pressureLog.length + coefficients.b;
      const pressureDiff = y1 - y0;
  
      return Math.round(pressureDiff);
    }

    function makeWeatherRequest() {
      getWeather(
        {
          url: `${host}/api/weather.php?id=1`,
        },
        (response) => {
          setLastWeather(response.data[0]);
        }
      );

      getWeather(
        {
          url: `${host}/api/weather.php?id=1&dateFrom=${getDateBeforeOnHours(2).dateTime}&dateTo=${currentDate().dateTime}`,
        },
        (response) => {
          setPressureDiff(getPressureDrop(response.data));
        }
      );
    }

    makeWeatherRequest();

    const timerID = setInterval(() => {
      makeWeatherRequest();
    }, 450000);

    return () => {
      clearTimeout(timerID);
    };
  }, [host, getWeather, pressureAprox]);

  function renderLeftBar(pressure) {
    return range(-250, 0, 0, 50, pressure);
  }

  function renderRightBar(pressure) {
    return range(0, 250, 50, 0, pressure);
  }

  return (
    <Card className={cardClasses['card--mb']}>
      <div className={classes['pressure-diff-container']}>
        <p className={classes['pressure-diff']}>Pressure changed on <span>{pressureDiff}Pa</span> per 2 hours.</p>
        <ul className={classes['bar-legend']}>
          <li>-250Pa (Storm)</li>
          <li>-200Pa</li>
          <li>-150Pa (Rain)</li>
          <li>-100Pa</li>
          <li>-50Pa (No changes)</li>
          <li>0Pa</li>
          <li>50Pa (No changes)</li>
          <li>100Pa</li>
          <li>150Pa (Sunny)</li>
          <li>200Pa</li>
          <li>250Pa</li>
        </ul>
        <div className={classes['bar']}>
          <div className={classes['bar__left']} style={{left: `${renderLeftBar(pressureDiff)}%`}}></div>
          <div className={classes['bar__right']} style={{right: `${renderRightBar(pressureDiff)}%`}}></div>
        </div>
      </div>
      <p>Last mesurment</p>
      <div className={`${classes["table-scroll"]} ${classes["last-weather"]} ${classes.row}`}>
      {lastWeather && (
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Date Time</th>
              <th>Temperature, °C</th>
              <th>Pressure, Pa</th>
              <th>Altitude, m</th>
              <th>Power supply, V</th>
            </tr>
            <tr>
              <td>{lastWeather.id}</td>
              <td>{localDateFormat(lastWeather.reg_date).dateTime}</td>
              <td>{lastWeather.t} °C</td>
              <td>{lastWeather.p} Pa</td>
              <td>{lastWeather.a} m</td>
              <td>{lastWeather.v} V</td>
            </tr>
            </tbody>
        </table>
      )}
      { !lastWeather && <p>No weather data</p>}
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