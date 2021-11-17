import { v4 as uuidv4 } from "uuid";

function CategoryStatistics(props) {
  const categoryList = props.categoryList.filter((category) => category !== 'all');
  const statistics = categoryList.map((categoryName) => {
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

  return statistics.length && (
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
  );
}

export default CategoryStatistics;