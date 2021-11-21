import React, { useEffect, useContext, Fragment, useState, useRef } from "react";
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
  const [ editing, setEditing] = useState('');
  const categoryInput = useRef();

  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);

  const { isLoading, sendRequest: getCategories } = useHttp();
  const {
    isLoading: isLoadingRemoveRequest,
    sendRequest: removeCategoryRequest,
  } = useHttp();
  const {
    isLoading: isLoadingRename,
    sendRequest: renameCategoryRequest,
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

  function editCategory(name) {
    categoryList.forEach(item => {
      if(item === name) {
        setEditing(name);

        if(editing !== '') {
          const newCategoryName = categoryInput.current.value;
          if (!newCategoryName || categoryList.includes(newCategoryName)) return;
          renameCategoryRequest(
            {
              url: `${ctxAPI.host}/api/category.php/`,
              method: 'PUT',
              body: {
                email: ctxAuth.email,
                categoryType,
                oldName: name,
                newName: newCategoryName
              },
            },
            (data) => {
              if (data.code === 0) {
                dispatch(categoryActions.setCategoryList({
                  category: categoryList.map((item) => {
                    if (item === name) {
                      return newCategoryName;
                    } else {
                      return item;
                    }
                  }),
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

          cancelEdition();
        }
      }
    });
  }

  function cancelEdition() {
    setEditing('');
  }

  return (
    <ul className={classes["category-list"]}>
      {categoryList && categoryList.map((item) => {
        const id = `${item}-${uuidv4()}`;
        const printItem = editing === '' || item !== editing;
        return (
          <li key={id} id={id} className={`${classes.row} ${item === 'all' ? classes['row--first'] : '' }`}>
            <span>
              { printItem && (item)}
              {item === editing && (<input ref={categoryInput} type='text' defaultValue={item} />)}
            </span>
            {item !== 'all' && (
              <div className={classes.btns}>
                <div className={classes['edit-btns']}>
                  <div className={classes['btn-container']}>
                    <Button
                      btnText={item === editing ? 'Save' : 'Edit'}
                      onClick={editCategory.bind(null, item)}
                      className={classesButton['btn']}
                    />
                  </div>
                  {item === editing && (
                    <div className={classes['btn-container']}>
                      <Button
                        btnText='Cancel'
                        onClick={cancelEdition}
                        className={classesButton['btn']}
                      />
                    </div>
                  )}
                </div>
                <Select
                  label='Rename category to'
                  option={categoryList.filter(category => category !== item)}
                  customClasses={classes.select}
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
      {(isLoading || isLoadingRemoveRequest || isLoadingRename) && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
    </ul>
  );
}

export default CategoryList;
