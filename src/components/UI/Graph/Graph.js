import { Fragment, useEffect } from 'react';

import classes from './Graph.module.scss';

const Graph = (props) => {
  const graphLib = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js';
  const { id, graphConfig } = props;

  useEffect(() => {
    const chartLib = document.getElementById('chart-lib');

    if (!chartLib) {
      const chartScript = document.createElement('script');
      chartScript.src = graphLib;
      chartScript.id = 'chart-lib';
      document.body.appendChild(chartScript);
    }

    if (window.Chart) {
      new window.Chart(id, graphConfig);
    }
  }, [id, graphConfig]);
  

  return (
    <Fragment>
      {(window.Chart && Object.keys(graphConfig).length !== 0)  && (
        <div className={classes['graph-container']}>
          <canvas id={props.id} className={classes.graph}></canvas>
        </div>
      )}
    </Fragment>
  );
}

export default Graph;