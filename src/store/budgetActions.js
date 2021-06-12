import { budgetActions } from './budget-slice';

export const fetchBudgetList = (host, email) => {
  return async (dispathc) => {
    async function fetchData() {
      const response = await fetch(`${host}/api/budget.php?email=${email}`);

      if (!response.ok) throw new Error('Could not fetch cart data!');

      const data = await response.json();
      return data;
    }

    try {
      const recivedData = await fetchData();
      if (recivedData && recivedData.data) {
        dispathc(
          budgetActions.getItems({
            data: recivedData.data
          })
        )
      }
    } catch(error) {
      console.log(error);
    }
  }
}