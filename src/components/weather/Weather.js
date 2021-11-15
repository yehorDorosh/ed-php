import { useContext, useState } from 'react';
import { v4 as uuidv4 } from "uuid";

import useHttp from "../../hooks/use-http";
import APIContext from "../../store/api-context";
import Card from '../UI/Card/Card';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import useDate from '../../hooks/use-date';
import WeatherGraph from './WeatherGraph';

import classes from "./Weather.module.scss";
import cardClasses from '../UI/Card/Card.module.scss';

const Weather = (props) => {
  const {localDateFormat, currentDate} = useDate();
  const ctxAPI = useContext(APIContext);
  const [isExpand, setIsExpand] = useState(false);

  const [date, setDate] = useState(currentDate().date);

  function expandWeatherBlock() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  const { isLoading, sendRequest: getWeather } = useHttp();
  const { host } = ctxAPI;

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
        <WeatherGraph data={weather} id='weather-log-graph' path='/js/weather-chart-init.js' />
      {weather && (
        <div className={`${classes["table-scroll"]}`}>
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
              {weather.map((row) => {
                return (
                  <tr key={`${row.id}-${uuidv4()}`}>
                    <td>{row.id}</td>
                    <td>{localDateFormat(row.reg_date).dateTime}</td>
                    <td>{row.t} °C</td>
                    <td>{row.p} Pa</td>
                    <td>{row.a} m</td>
                    <td>{row.v} V</td>
                  </tr>
                );
              })}
              </tbody>
          </table>
        </div>
        
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

export default Weather;