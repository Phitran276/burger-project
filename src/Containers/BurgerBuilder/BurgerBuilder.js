import React, { Component } from 'react';
import Aux from '../../Hoc/AuxComponent';

import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSumary from '../../Components/Burger/OrderSumary/OrderSumary';
import axios from '../../axios-orders';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../Hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 1.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 0,
        purchasable: false,
        purchasing: false,
        loading: false
    }

    componentDidMount() {
        console.log('[BurgerBuilder.js] componentDidMount');
        axios.get(`https://react-my-burger-6ad08.firebaseio.com/ingredients.json`)
            .then(response => {
                const total = Object.keys(response.data).reduce((acc, key) => {
                    acc += INGREDIENT_PRICES[key] * response.data[key];
                    return acc;
                }, 0);
                this.setState({ 
                    ingredients: response.data,
                    totalPrice: parseFloat(total.toFixed(2)),
                    purchasable: total > 0
                 });
            });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((acc, el) => {
                return acc += el;
            }, 0);

        this.setState({
            purchasable: sum > 0
        });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        let newPrice = (this.state.totalPrice + priceAddition);
        newPrice = parseFloat(newPrice.toFixed(2));
        this.setState({
            ingredients: updatedIngredients,
            totalPrice: newPrice
        });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount !== 0) {
            const updatedCount = oldCount - 1;
            const updatedIngredients = {
                ...this.state.ingredients
            };
            updatedIngredients[type] = updatedCount;
            const priceDeduction = INGREDIENT_PRICES[type];
            let newPrice = (this.state.totalPrice - priceDeduction);
            newPrice = parseFloat(newPrice.toFixed(2));
            this.setState({
                ingredients: updatedIngredients,
                totalPrice: newPrice
            });
            this.updatePurchaseState(updatedIngredients);
        }
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        
        const queryParams = [];
        for (let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push(`price=${this.state.totalPrice}`);
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {
        let orderSummary = <Spinner />;

        if (!this.state.loading && this.state.ingredients) {
            orderSummary = (
                <OrderSumary ingredients={this.state.ingredients}
                    cancel={this.purchaseCancelHandler}
                    continue={this.purchaseContinueHandler}
                    price={this.state.totalPrice} />
            );
        }

        let burger = <Spinner />;
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls addIng={this.addIngredientHandler}
                        removeIng={this.removeIngredientHandler}
                        price={this.state.totalPrice}
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler} />
                </Aux>
            );
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);