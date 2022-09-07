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
  const {localDateFormat, currentDate, dateFormat} = useDate();
  const ctxAPI = useContext(APIContext);
  const [isExpand, setIsExpand] = useState(false);

  const [startDate, setStartDate] = useState(`${currentDate().date}T00:00`);
  const [endDate, setEndDate] = useState(`${currentDate().date}T23:59`);

  const [id, setId] = useState('1');

  function expandWeatherBlock() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  const { isLoading, sendRequest: getWeather } = useHttp();
  const { host } = ctxAPI;

  const [weather, setWeather] = useState([]);
  const [graphConfig, setGraphConfig] = useState({});
  const [graphMode, setGraphMode] = useState('temperature');

  function buildGraphConfig(weatherData) {
    if (!weatherData.length) return;

    let color = 'red';
    const label = {
      'temperature': 'Temperature, °C',
      'pressure': 'Pressure, Pa',
      'voltage': 'Voltage, V'
    };
    const d = weatherData.map((row) => {
      if (graphMode === 'temperature') {
        color = 'red';
        return row.t;
      } else if (graphMode === 'pressure') {
        color = 'blue';
        if (row.p < 95000) { return null; }
        return row.p;
      } else if (graphMode === 'voltage') {
        color = 'green';
        return row.v;
      } else {
        return row.a;
      }
    });
    const date = weatherData.map(row => localDateFormat(row.reg_date).dateTime);

    const config = {
      type: "line",
      data: {
        labels: date,
        datasets: [
          {
            label: label[graphMode],
            borderColor: color,
            data: d,
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
    const start = new Date(`${startDate.replace('T', ' ')}`);
    const end = new Date(`${endDate.replace('T', ' ')}`);
    const timeShift = (start - new Date(localDateFormat(startDate).dateTime)) / 3600000;
    start.setHours(start.getHours() + timeShift);
    end.setHours(end.getHours() + timeShift);
  
    getWeather(
      {
        url: `${host}/api/weather.php?id=${id}&dateFrom=${dateFormat(start).dateTime}&dateTo=${dateFormat(end).dateTime}`,
      },
      (response) => {
        setWeather(response.data);
        if (!response.data.length) return;
        buildGraphConfig(response.data);
      }
    );
  }

  function startDateHandler(e) {
    setStartDate(e.target.value);
  }

  function endDateHandler(e) {
    setEndDate(e.target.value);
  }

  function graphModeHandler(e) {
    setGraphMode(e.target.value);
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
              type: 'datetime-local',
              name: 'startDate',
              id: 'startDate',
            }}
            label='From'
            value={startDate}
            onChange={startDateHandler}
            onBlur={startDateHandler}
            customClasses={classes['mb-2']}
          />
          <Input
            input={{
              type: 'datetime-local',
              name: 'endDate',
              id: 'endDate',
            }}
            label='To'
            value={endDate}
            onChange={endDateHandler}
            onBlur={endDateHandler}
            customClasses={classes['mb-2']}
          />
          <Select
            label='Sensor ID'
            option={IDs}
            value={id}
            customClasses={classes['mb-2']}
            onChange={idInputHandler}
            onBlur={idInputHandler}
          />
          <Select
            label='Data'
            option={['temperature', 'pressure', 'voltage']}
            value={graphMode}
            onChange={graphModeHandler}
            onBlur={graphModeHandler}
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