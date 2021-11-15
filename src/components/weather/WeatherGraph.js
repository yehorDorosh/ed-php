import { useEffect } from 'react';

import classes from './WeatherGraph.module.scss';
import useDate from '../../hooks/use-date';

const WeatherGraph = (props) => {
  const { localDateFormat } = useDate();

  const chartLib = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
  const { data, path, coefficients, id } = props;

  useEffect(() => {
    const chartScript = document.getElementById('chart-script');
    const initChartScript = document.getElementById(`chart-init-${id}`);

    function initChart() {
      const initChartScript = document.createElement('script');
      initChartScript.src = path;
      initChartScript.id = `chart-init-${id}`;
      document.body.appendChild(initChartScript);
    }

    function removeChartScript() {
      if (initChartScript) {
        initChartScript.parentNode.removeChild(initChartScript);
      }
    }

    if (data.length) {
      window[`chartData-${id}`] = {
        date: data.map(row => localDateFormat(row.reg_date).dateTime),
        t: data.map(row => row.t),
        p: data.map(row => row.p),
        v: data.map(row => row.v),
        k: coefficients,
      }
    }

    if (!chartScript) {
      const chartScript = document.createElement('script');
      chartScript.src = chartLib;
      chartScript.id = 'chart-script';
      document.body.appendChild(chartScript);
    }

    if (initChartScript) {
      removeChartScript();
      initChart();
    }

    if (!initChartScript && chartScript) {
      initChart();
    }
  }, [data, localDateFormat, path, coefficients, id]);
  

  return (
    <div className={classes['graph-container']}>
      <canvas id={props.id} className={classes.graph}></canvas>
    </div>
  );
}

export default WeatherGraph;