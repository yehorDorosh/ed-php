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

  const { categoryType } = props;
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
        if (Array.isArray(newCategoryList)) setCategoryList(newCategoryList);
      }
    });
  }, [categoryType, host, email, getCategories, showErrorPopup, closeErrorPopup]);
  
  return (
    <ul className={classes['category-list']}>
      {categoryList.map((item) => (
        <li key={`${item}-${uuidv4()}`} className={classes.row}>
          <span>{item}</span>
          <Button btnText="Delete category" />
        </li>
      ))}
      {isLoading && (
        <div className={classes.load}>
          <div className={classes.loader}></div>
        </div>
      )}
    </ul>
  );
}

export default CategoryList;