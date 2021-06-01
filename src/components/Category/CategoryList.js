import React, { useEffect, useContext, useState, Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Button from '../UI/Button/Button';
import useHttp from '../../hooks/use-http';
import APIContext from '../../store/api-context';
import AuthContext from '../../store/auth-context';
import ModalContext from '../../store/modal-context';


import classes from './CategoryList.module.scss';

function CategoryList(props) {
  const ctxAPI = useContext(APIContext);
  const ctxAuth = useContext(AuthContext);
  const ctxModal = useContext(ModalContext);
  const [ categoryList, setCategoryList ] = useState([]);

  const { isLoading, sendRequest: getCategories } = useHttp();
  const { isLoading: isLoadingRemoveRequest, sendRequest: removeCategoryRequest } = useHttp();

  const { categoryType, rerender } = props;
  const { host } = ctxAPI;
  const { email } = ctxAuth;
  const { onShown: showErrorPopup, onClose: closeErrorPopup} = ctxModal;

  useEffect(() => {
    getCategories({
      url: `${host}/api/category.php?email=${email}&categoryType=${categoryType}`,
    }, (response) => {
      if(response.error) {
        showErrorPopup(
          <Fragment>
            <p>Error occured, when tried get list of categories:</p>
            <p>{response.errorMessage}</p>
            <Button btnText="OK" onClick={closeErrorPopup} />
          </Fragment>
        );
        console.log(`Error occured, when tried get list of categories: ${response.errorMessage}`);
        
      } else {
        const newCategoryList = JSON.parse(response.data);
        if (Array.isArray(newCategoryList)) setCategoryList(newCategoryList.sort());
      }
    });
  }, [categoryType, host, email, rerender, getCategories, showErrorPopup, closeErrorPopup]);

  function removeCategory(categoryName) {
    removeCategoryRequest(
      {
        url: `${ctxAPI.host}/api/category.php/`,
        method: 'DELETE',
        body: {
          email: ctxAuth.email,
          categoryType,
          categoryName,
        }
      }, (data) => {
        if (data.code === 0) {
          setCategoryList(categoryList.filter(item => item !== categoryName));
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
  
  return (
    <ul className={classes['category-list']}>
      {categoryList.map((item) => {
        const id = `${item}-${uuidv4()}`;
        return (
        <li
          key={id}
          id={id}
          className={classes.row}
        >
          <span>{item}</span>
          {item !== 'all' && <Button btnText="Delete category" onClick={removeCategory.bind(null, item)} />}
        </li>
      )})}
      {(isLoading || isLoadingRemoveRequest) && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
    </ul>
  );
}

export default CategoryList;