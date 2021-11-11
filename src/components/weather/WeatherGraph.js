import { useEffect } from 'react';

import classes from './WeatherGraph.module.scss';
import useDate from '../../hooks/use-date';

const WeatherGraph = (props) => {
  const { localDateFormat } = useDate();

  const chartLib = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
  const { data } = props;

  useEffect(() => {
    const chartScript = document.getElementById('chart-script');
    const initChartScript = document.getElementById('chart-init');

    function initChart() {
      const initChartScript = document.createElement('script');
      initChartScript.src = '/js/weather-chart-init.js';
      initChartScript.id = 'chart-init';
      document.body.appendChild(initChartScript);
    }

    function removeChartScript() {
      if (initChartScript) {
        initChartScript.parentNode.removeChild(initChartScript);
      }
    }

    window.chartData = {
      date: data.map(row => localDateFormat(row.reg_date).dateTime),
      t: data.map(row => row.t),
      p: data.map(row => row.p / 1000),
      v: data.map(row => row.v),
    }

    if (!chartScript) {
      const chartScript = document.createElement('script');
      chartScript.src = chartLib;
      chartScript.id = 'chart-script';
      document.body.appendChild(chartScript);

      chartScript.onload = () => {
        initChart();
      }
    }

    if (initChartScript) {
      removeChartScript();
      initChart();
    }
  }, [data, localDateFormat]);
  

  return (
    <div className={classes['graph-container']}>
      <canvas id="myChart" className={classes.graph}></canvas>
    </div>
  );
}

export default WeatherGraph;