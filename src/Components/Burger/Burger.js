import React from 'react';

//Dispatch data router from parent component and child component
// import { withRouter } from 'react-router-dom';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';
import uniqid from 'uniqid';

const burger = (props) => {
    console.log('Ingredients to render ', props);
    const transformedIngredients = Object.keys(props.ingredients)
        .map(key => {
            return [...Array(props.ingredients[key])].map((_, i) => {
                return (<BurgerIngredient key={uniqid()} type={key} />);
            });
        })
        .reduce((arr, el) => {
            return arr.concat(el);
        }, []);

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients.length ? transformedIngredients : <p>Please start adding ingredients!</p>}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
}

export default burger;