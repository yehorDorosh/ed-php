import React, { useState, useCallback } from 'react';

import Card from '../UI/Card/Card';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
import ExpandBlock from '../UI/ExpandBlock/ExpandBlock';

import classes from './Category.module.scss';

function Category() {
  const [isExpand, setIsExpand] = useState(false);
  const [currentCategoryType, setCurrentCategoryType] = useState('expense');
  const [rerender, setRerender] = useState(false);

  function expandCategoryBlock() {
    isExpand ? setIsExpand(false) : setIsExpand(true);
  }

  const getCurrentCategoryType = useCallback((categoryType) => {
    setCurrentCategoryType(categoryType);
  }, []);

  return (
    <Card>
      <ExpandBlock isExpand={isExpand} expandTarget={expandCategoryBlock} btnText='Categories' />
      <div className={`${classes.category} ${isExpand ? 'shown' :'hidden'}`}>
        <CategoryForm
          rerender={setRerender}
          liftUpCategoryType={getCurrentCategoryType}
        />
        <CategoryList categoryType={currentCategoryType} rerender={rerender}/>
      </div>
    </Card>
  );
}

export default Category;
