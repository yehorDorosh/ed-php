/* global Chart */

(() => {
  const data = window['chartData-weather-pressure-graph'];

  if ( !data || !Chart ) return;
  const date = data.date;
  const p = data.p;
  const k = data.k;

  let line = [];
  buildLine(k, p);

  const weatherPressureGraph = new Chart("weather-pressure-graph", {
    type: "line",
    data: {
      labels: date,
      datasets: [{
        type: "scatter",
        pointRadius: 4,
        label: 'Pressure, Pa',
        borderColor: 'blue',
        data: p,
        fill: false,
      },
      {
        type: 'line',
        label: `Aproximation y=${k.a.toFixed(0)}*x + ${k.b.toFixed(0)}`,
        fill: false,
        pointRadius: 1,
        borderColor: "rgba(255,0,0,0.5)",
        data: line
      }
    ],
    },
    options: {}
  });

  function buildLine(k, p) {
    for (let x = 1; x <= p.length; x++) {
      line.push(k.a * x + k.b)
    }
  }
})();