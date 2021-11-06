import { useContext, useEffect, useState } from 'react';

import useHttp from "../../hooks/use-http";
import useAprox from '../../hooks/use-aprox';
import useDate from '../../hooks/use-date';
import APIContext from "../../store/api-context";
import Card from '../UI/Card/Card';

import classes from "./LastWeather.module.scss";
import cardClasses from '../UI/Card/Card.module.scss';

// Liner interpolation https://www.trysmudford.com/blog/linear-interpolation-functions/
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

const LastWeather = (props) => {
  const ctxAPI = useContext(APIContext);
  const { isLoading, sendRequest: getWeather } = useHttp();
  const {aprox: pressureAprox} = useAprox();
  const {localDateFormat, dateFormat, currentDate} = useDate();
  const { host } = ctxAPI;

  const [lastWeather, setLastWeather] = useState();
  const [pressureDiff, setPressureDiff] = useState();

  useEffect(() => {
    function getDateBeforeOnHours(h) {
      const today = new Date();
      today.setHours(today.getHours() - h);
      return dateFormat(today);
    }

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
  }, [host, getWeather, pressureAprox, currentDate, dateFormat]);

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
      <p className={classes['text-center']}>Last mesurment</p>
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