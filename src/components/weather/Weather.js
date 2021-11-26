import { useContext, useState } from 'react';
import { v4 as uuidv4 } from "uuid";

import useHttp from "../../hooks/use-http";
import APIContext from "../../store/api-context";
import Card from '../UI/Card/Card';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import useDate from '../../hooks/use-date';
import Select from '../UI/Select/Select';

import classes from "./Weather.module.scss";
import cardClasses from '../UI/Card/Card.module.scss';
import Graph from '../UI/Graph/Graph';

const IDs = ['1', 'out-of-door', '2nd-floor'];

const Weather = (props) => {
  const {localDateFormat, currentDate} = useDate();
  const ctxAPI = useContext(APIContext);
  const [isExpand, setIsExpand] = useState(false);

  const [date, setDate] = useState(currentDate().date);
  const [id, setId] = useState('1');

  function expandWeatherBlock() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  const { isLoading, sendRequest: getWeather } = useHttp();
  const { host } = ctxAPI;

  const [weather, setWeather] = useState([]);
  const [graphConfig, setGraphConfig] = useState({});

  function buildGraphConfig(weatherData) {
    if (!weatherData.length) return;

    const t = weatherData.map(row => row.t);
    const date = weatherData.map(row => localDateFormat(row.reg_date).dateTime);

    const config = {
      type: "line",
      data: {
        labels: date,
        datasets: [
          {
            label: 'Temperature, °C',
            borderColor: 'red',
            data: t,
            fill: false,
          }
        ],
      },
      options: {}
    }

    setGraphConfig(config);
  }

  function makeWeatherRequest(e) {
    e.preventDefault();
  
    getWeather(
      {
        url: `${host}/api/weather.php?id=${id}&date=${date}`,
      },
      (response) => {
        setWeather(response.data);
        if (!response.data.length) return;
        buildGraphConfig(response.data);
      }
    );
  }

  function dayHandler(e) {
    setDate(e.target.value);
  }

  function idInputHandler(e) {
    setId(e.target.value);
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
            customClasses={classes['mb-2']}
          />
          <Select
            label='Sensor ID'
            option={IDs}
            value={id}
            customClasses={''}
            onChange={idInputHandler}
            onBlur={idInputHandler}
          />
          <div className={`${classes.row}`}>
            <Button btnText="Get data" />
          </div>
        </form>
        { weather.length !== 0 && <Graph id='weatherTemperatureGraph'  graphConfig={graphConfig}/>}
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