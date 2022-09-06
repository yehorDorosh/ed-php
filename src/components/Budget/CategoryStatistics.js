import { Fragment } from "react";

import { v4 as uuidv4 } from "uuid";

import Graph from '../UI/Graph/Graph';

function CategoryStatistics(props) {

  const categoryList = props.categoryList.filter((category) => category !== 'all');
  let statistics = categoryList.map((categoryName) => {
    const categoryTotal = props.itemList.reduce((acc, curr) => {
      if(curr.category === categoryName) {
        return (acc + +curr.amount);
      } else {
        return acc;
      }
    }, 0);
    return {
      [categoryName]: categoryTotal.toFixed(2)
    }
  });

  statistics.sort((a, b) => {
    let aAmount = 0;
    let bAmount = 0;
    for (let key in a) {
      aAmount = a[key];
    }
    for (let key in b) {
      bAmount = b[key];
    }
    return bAmount - aAmount;
  });

  statistics = statistics.filter(category => category[Object.keys(category)[0]] > 0);

  const config = {
    type: 'bar',
    data: {
      labels: statistics.map(obj => Object.keys(obj)[0]),
      datasets: [
        {
          label: 'Category',
          data: statistics.map(obj => obj[Object.keys(obj)[0]]),
          backgroundColor: 'blue',
        }
      ],
    },
    options: {}
  }

  return statistics.length && (
    <Fragment>
      <div>
        <p>Categories statistics</p>
        <ul>
          {statistics.map((obj) => {
            let name;
            for (let key in obj) {
              name = key;
            }
            return (
              <li key={uuidv4()}>{`${name}: ${obj[name]}`}</li>
            );
          })}
        </ul>
      </div>
      <div style={{ width: '100%' }}>
        <Graph id='categoryGraph'  graphConfig={config}/>
      </div>
    </Fragment>
  );
}

export default CategoryStatistics;