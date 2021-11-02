import { useContext, useEffect, useState } from 'react';

import useHttp from "../../hooks/use-http";
import APIContext from "../../store/api-context";
import Card from '../UI/Card/Card';
//import ModalContext from "../../store/modal-context";

import classes from "./LastWeather.module.scss";
import cardClasses from '../UI/Card/Card.module.scss';

const LastWeather = () => {
  const ctxAPI = useContext(APIContext);
  //const ctxModal = useContext(ModalContext);

  const { isLoading, sendRequest: getWeather } = useHttp();
  const { host } = ctxAPI;
  //const { onShown: showErrorPopup, onClose: closeErrorPopup } = ctxModal;

  const [lastWeather, setLastWeather] = useState();

  useEffect(() => {
    getWeather(
      {
        url: `${host}/api/weather.php?id=1`,
      },
      (response) => {
        setLastWeather(response.data[0]);
      }
    );
  }, [host, getWeather]);

  return (
    <Card className={cardClasses['card--mb']}>
      <div className={`${classes["last-weather"]} ${classes.row}`}>
      {lastWeather && (
        <table>
          <tbody>
            <tr>
              <th>ID</th>
              <th>Temperature</th>
              <th>Pressure</th>
              <th>Attitude</th>
              <th>Date Time</th>
            </tr>
            <tr>
              <td>{lastWeather.id}</td>
              <td>{lastWeather.t}</td>
              <td>{lastWeather.p}</td>
              <td>{lastWeather.a}</td>
              <td>{lastWeather.reg_date}</td>
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