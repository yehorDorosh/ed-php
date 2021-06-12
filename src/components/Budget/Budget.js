import React, { useState, useEffect, useContext, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import Card from "../UI/Card/Card";
import ExpandBlock from "../UI/ExpandBlock/ExpandBlock";
import BudgetTable from "./BudgetTable";
import { fetchBudgetList } from "../../store/budgetActions";
import APIContext from "../../store/api-context";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";
import useHttp from "../../hooks/use-http";
import Button from "../UI/Button/Button";

import classes from "./Budget.module.scss";
import cardClasses from "../UI/Card/Card.module.scss";

function Budget() {
  const dispatch = useDispatch();
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const [isExpand, setIsExpand] = useState(false);

  const itemList = useSelector((state) => state.budget.itemList);
  const itemsLoading = useSelector((state) => state.budget.isLoading);

  const { isLoading: isDeleting, sendRequest: fetchItem } = useHttp();

  const { email } = ctxAuth;
  const { host } = ctxAPI;

  useEffect(() => {
    dispatch(fetchBudgetList(host, email));
  }, [dispatch, host, email]);

  function expandTable() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  function removeItem(id) {
    fetchItem(
      {
        url: `${host}/api/budget.php/`,
        method: "DELETE",
        body: {
          email,
          id,
        },
      },
      (data) => {
        if (data.code !== 0) {
          ctxModal.onShown(
            <Fragment>
              <p>Saving error.</p>
              <p>{data.errorMsg}</p>
              <Button btnText="OK" onClick={ctxModal.onClose} />
            </Fragment>
          );
        } else {
          dispatch(fetchBudgetList(host, email));
        }
      }
    );
  }

  return (
    <Card className={cardClasses["card--mb"]}>
      <ExpandBlock
        isExpand={isExpand}
        expandTarget={expandTable}
        btnText="Expense/Income table"
      />
      <div className={`${classes.block} ${isExpand ? "shown" : "hidden"}`}>
        <BudgetTable
          itemList={itemList}
          removeItem={removeItem}
          isLoading={isDeleting || itemsLoading}
        />
      </div>
    </Card>
  );
}

export default Budget;
