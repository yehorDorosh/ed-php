import { Fragment } from "react";

import LastWeather from './LastWeather';
import Weather from './Weather';

const WeatherBlock = () => {

  return (
    <Fragment>
      <LastWeather />
      <Weather />
    </Fragment>
  );
}

export default WeatherBlock;