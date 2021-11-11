(() => {
  if ( !window.chartData || !Chart ) return;
  const date = window.chartData.date;
  const t =window.chartData.t;
  const v =window.chartData.v;
  const p =window.chartData.p;

  const myChart = new Chart("myChart", {
    type: "line",
    data: {
      labels: date,
      datasets: [{
        label: 'Temperature, °C',
        borderColor: 'red',
        data: t,
        fill: false,
      },
      // {
      //   label: 'Pressure, kPa',
      //   borderColor: 'blue',
      //   data: p,
      //   fill: false,
      // },
      // {
      //   label: 'Voltage, V',
      //   borderColor: 'green',
      //   data: v,
      //   fill: false,
      // }
    ],
    },
    options: {}
  });
})();