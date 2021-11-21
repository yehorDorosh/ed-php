import React, { useEffect, useContext, Fragment, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from "uuid";

import Button from "../UI/Button/Button";
import Select from '../UI/Select/Select';
import useHttp from "../../hooks/use-http";
import APIContext from "../../store/api-context";
import AuthContext from "../../store/auth-context";
import ModalContext from "../../store/modal-context";
import { categoryActions } from '../../store/category-slice';
import { fetchBudgetList } from '../../store/budgetActions';

import classes from "./CategoryList.module.scss";
import classesButton from "../../components/UI/Button/Button.module.scss";

function CategoryList(props) {
  const dispatch = useDispatch();
  const [renameCategory, setRenameCategory] = useState();

  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const { isLoading, sendRequest: getCategories } = useHttp();
  const {
    isLoading: isLoadingRemoveRequest,
    sendRequest: removeCategoryRequest,
  } = useHttp();

  const { categoryType, rerender } = props;
  const categoryList = useSelector((state) => {
    if (categoryType === `expense`) return state.category.expense;
    if (categoryType === `income`) return state.category.income;
  });
  const { host } = ctxAPI;
  const { email } = ctxAuth;
  const { onShown: showErrorPopup, onClose: closeErrorPopup } = ctxModal;

  useEffect(() => {
    getCategories(
      {
        url: `${host}/api/category.php?email=${email}&categoryType=expense`,
      },
      (response) => {
        dispatch(categoryActions.fetchedCategoryHandler({
          data: response.data,
          categoryType: 'expense'
        }));
      }
    );
    getCategories(
      {
        url: `${host}/api/category.php?email=${email}&categoryType=income`,
      },
      (response) => {
        dispatch(categoryActions.fetchedCategoryHandler({
          data: response.data,
          categoryType: 'income'
        }));
      }
    );
  }, [
    categoryType,
    host,
    email,
    rerender,
    getCategories,
    dispatch
  ]);

  function removeCategory(categoryName, renameCategory) {
    removeCategoryRequest(
      {
        url: `${ctxAPI.host}/api/category.php/`,
        method: "DELETE",
        body: {
          email: ctxAuth.email,
          categoryType,
          categoryName,
          renameCategory
        },
      },
      (data) => {
        if (data.code === 0) {
          dispatch(categoryActions.setCategoryList({
            category: categoryList.filter((item) => item !== categoryName),
            categoryType
          }));
          dispatch(fetchBudgetList(host, email));
        } else if (data.code === 1) {
          showErrorPopup(
            <Fragment>
              <p>Data base error.</p>
              <p>{data.db.errorMessage}</p>
              <Button btnText="OK" onClick={closeErrorPopup} />
            </Fragment>
          );
        }
      }
    );
  }

  function renameCategoryHandler(e) {
    setRenameCategory(e.target.value);
  }

  return (
    <ul className={classes["category-list"]}>
      {categoryList && categoryList.map((item) => {
        const id = `${item}-${uuidv4()}`;
        return (
          <li key={id} id={id} className={`${classes.row} ${item === 'all' ? classes['row--first'] : '' }`}>
            <span>{item}</span>
            {item !== 'all' && (
              <div>
                <Select
                  label='Rename category to'
                  option={categoryList.filter(category => category !== item)}
                  customClasses={''}
                  value={renameCategory}
                  onChange={renameCategoryHandler}
                  onBlur={renameCategoryHandler}
                />
                <Button
                  btnText="Delete category"
                  onClick={removeCategory.bind(null, item, renameCategory)}
                  className={classesButton['btn--red']}
                />
              </div>
            )}
          </li>
        );
      })}
      {(isLoading || isLoadingRemoveRequest) && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
    </ul>
  );
}

export default CategoryList;
