/* global Chart */

(() => {
  const data = window['chartData-weather-log-graph'];
  if ( !data || !Chart ) return;
  const date = data.date;
  const t = data.t;

  const myChart = new Chart('weather-log-graph', {
    type: 'line',
    data: {
      labels: date,
      datasets: [{
        label: 'Temperature, °C',
        borderColor: 'red',
        data: t,
        fill: false,
      },
    ],
    },
    options: {}
  });
})();