import { Fragment, useContext, useEffect, useState } from 'react';

import useHttp from "../../hooks/use-http";
import useAprox from '../../hooks/use-aprox';
import useDate from '../../hooks/use-date';
import APIContext from "../../store/api-context";
import Card from '../UI/Card/Card';

import classes from "./LastWeather.module.scss";
import cardClasses from '../UI/Card/Card.module.scss';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import Graph from '../UI/Graph/Graph';

// Liner interpolation https://www.trysmudford.com/blog/linear-interpolation-functions/
const lerp = (x, y, a) => x * (1 - a) + y * a;
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));
const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));

const LastWeather = (props) => {
  const ctxAPI = useContext(APIContext);
  const { isLoading, sendRequest: getWeather } = useHttp();
  const {aprox: pressureAprox} = useAprox();
  const {localDateFormat, dateFormat, currentDate, serverCurrentTime} = useDate();
  const { host } = ctxAPI;

  const [lastWeather, setLastWeather] = useState();
  const [pressureDiff, setPressureDiff] = useState();
  const [pressureChangingPeriod, setPressureChangingPeriod] = useState(2);
  const [graphConfig, setGraphConfig] = useState({});
  const [isExpand, setIsExpand] = useState(false);
  const [isDataRecived, setIsDataRecived] = useState(false);

  useEffect(() => {
    function getDateBeforeHours(h) {
      const today = new Date();
      today.setHours(today.getHours() - h);
      const serverDate = today.toLocaleString('en-US', {timeZone: 'Europe/London'});
      return dateFormat(new Date(serverDate));
    }

    function getPressureChanging(data) {
      if (!data.length) return null;
      const pressureLog = data.map(row => row.p);
      const coefficients = pressureAprox(pressureLog);
  
      const y0 = coefficients.a * 1 + coefficients.b;
      const y1 = coefficients.a * pressureLog.length + coefficients.b;
      const pressureDiff = y1 - y0;
  
      return {
        diff: Math.round(pressureDiff),
        k: coefficients
      };
    }

    function buildGraphConfig(weatherData) {
      if (!weatherData.length) return;

      const p = weatherData.map(row => row.p);
      const date = weatherData.map(row => localDateFormat(row.reg_date).dateTime);
      const f = getPressureChanging(weatherData).k;
      let line = [];

      if (!Object.keys(f).length) return;

      buildLine(f, p);

      function buildLine(k, p) {
        for (let x = 1; x <= p.length; x++) {
          line.push(k.a * x + k.b)
        }
      }

      const config = {
        type: "line",
        data: {
          labels: date,
          datasets: [
            {
              type: "scatter",
              pointRadius: 4,
              label: 'Pressure, Pa',
              borderColor: 'blue',
              data: p,
              fill: false,
            },
            {
              type: 'line',
              label: `Aproximation y=${f.a.toFixed(0)}*x + ${f.b.toFixed(0)}`,
              fill: false,
              pointRadius: 1,
              borderColor: "rgba(255,0,0,0.5)",
              data: line
            }
          ],
        },
        options: {}
      }

      setGraphConfig(config);
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
          url: `${host}/api/weather.php?id=1&dateFrom=${getDateBeforeHours(pressureChangingPeriod).dateTime}&dateTo=${serverCurrentTime().dateTime}`,
        },
        (response) => {
          if (!response.data.length) return;
          setIsDataRecived(true);
          setPressureDiff(getPressureChanging(response.data).diff);
          buildGraphConfig(response.data);
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
  }, [
      host,
      getWeather,
      pressureAprox,
      currentDate,
      dateFormat,
      serverCurrentTime,
      localDateFormat,
      pressureChangingPeriod,
    ]
  );

  function renderLeftBar(pressure) {
    return range(-250, 0, 0, 50, pressure);
  }

  function renderRightBar(pressure) {
    return range(0, 250, 50, 0, pressure);
  }

  function pressurePeriodHandler(e) {
    setPressureChangingPeriod(e.target.value);
  }

  function expandWeatherBlock() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  return (
    <Card className={cardClasses['card--mb']}>
      <div className={classes['pressure-diff-container']}>
        <p className={classes['pressure-diff']}>Pressure changed on <span>{pressureDiff}Pa</span> per 
        <input
          type="number"
          defaultValue={pressureChangingPeriod}
          onBlur={pressurePeriodHandler}
          onChange={pressurePeriodHandler}
        />
         hours.</p>
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
      { isDataRecived && (
        <Fragment>
          <ExpandBlock isExpand={isExpand} expandTarget={expandWeatherBlock} btnText='Pressure graph' />
          <div className={`${isExpand ? 'shown' : 'hidden'}`}>
            <Graph id='weatherPressureGraph'  graphConfig={graphConfig} />
          </div>
        </Fragment>
      )}
    </Card>
  );
}

export default LastWeather;