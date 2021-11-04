import { useContext, useEffect, useState } from 'react';

import useHttp from "../../hooks/use-http";
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
    dataTime: `${year}-${month}-${day} ${h}:${m}:${s}`,
    data: `${year}-${month}-${day}`,
    time: `${h}:${m}:${s}`,
    yearMonth: `${year}-${month}`,
  }
}

const LastWeather = () => {
  const ctxAPI = useContext(APIContext);
  //const ctxModal = useContext(ModalContext);

  const { isLoading, sendRequest: getWeather } = useHttp();
  const { host } = ctxAPI;
  //const { onShown: showErrorPopup, onClose: closeErrorPopup } = ctxModal;

  const [lastWeather, setLastWeather] = useState();

  useEffect(() => {
    function makeWeatherRequest() {
      getWeather(
        {
          url: `${host}/api/weather.php?id=1`,
        },
        (response) => {
          setLastWeather(response.data[0]);
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
  }, [host, getWeather]);

  return (
    <Card className={cardClasses['card--mb']}>
      <div className={`${classes["last-weather"]} ${classes.row}`}>
      {lastWeather && (
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Temperature, °C</th>
              <th>Pressure, Pa</th>
              <th>Altitude, m</th>
              <th>Date Time</th>
            </tr>
            <tr>
              <td>{lastWeather.id}</td>
              <td>{lastWeather.t} °C</td>
              <td>{lastWeather.p} Pa</td>
              <td>{lastWeather.a} m</td>
              <td>{localDateFormat(lastWeather.reg_date).dataTime}</td>
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