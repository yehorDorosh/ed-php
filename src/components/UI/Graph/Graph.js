import { useEffect } from 'react';

import classes from './Graph.module.scss';

const Graph = (props) => {
  const graphLib = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
  const { id, graphConfig } = props;

  useEffect(() => {
    function createGraph() {
      if (Object.keys(graphConfig).length !== 0) {
        window.id?.destroy();
        window.id = new window.Chart(id, graphConfig);
      }
    }

    let chartScript = document.getElementById('chart-lib');

    if (!chartScript) {
      chartScript = document.createElement('script');
      chartScript.src = graphLib;
      chartScript.id = 'chart-lib';
      document.body.appendChild(chartScript);
    }

    if (!window.Chart) chartScript.onload = createGraph;
    else createGraph();
  }, [id, graphConfig]);
  

  return (
    <div className={classes['graph-container']}>
      <canvas id={props.id} className={classes.graph}></canvas>
    </div>
  );
}

export default Graph;