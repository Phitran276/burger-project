import React, { Component } from 'react';
import Aux from '../../Hoc/AuxComponent';
import {connect} from 'react-redux';

import Burger from '../../Components/Burger/Burger';
import BuildControls from '../../Components/Burger/BuildControls/BuildControls';
import Modal from '../../Components/UI/Modal/Modal';
import OrderSumary from '../../Components/Burger/OrderSumary/OrderSumary';
import axios from '../../axios-orders';
import Spinner from '../../Components/UI/Spinner/Spinner';
import withErrorHandler from '../../Hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component {

    state = {
        purchasing: false,
        loading: false
    }

    componentDidMount() {
        console.log('[BurgerBuilder.js] componentDidMount');
        // axios.get(`https://react-my-burger-6ad08.firebaseio.com/ingredients.json`)
        //     .then(response => {
        //         const total = Object.keys(response.data).reduce((acc, key) => {
        //             acc += INGREDIENT_PRICES[key] * response.data[key];
        //             return acc;
        //         }, 0);
        //         this.setState({ 
        //             ingredients: response.data,
        //             totalPrice: parseFloat(total.toFixed(2)),
        //             purchasable: total > 0
        //          });
        //     });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((acc, el) => {
                return acc += el;
            }, 0);

        return sum > 0
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.props.ings[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.props.ings
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     let newPrice = (this.state.totalPrice + priceAddition);
    //     newPrice = parseFloat(newPrice.toFixed(2));
    //     this.setState({
    //         ingredients: updatedIngredients,
    //         totalPrice: newPrice
    //     });
    //     this.updatePurchaseState(updatedIngredients);
    // }

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.props.ings[type];
    //     if (oldCount !== 0) {
    //         const updatedCount = oldCount - 1;
    //         const updatedIngredients = {
    //             ...this.props.ings
    //         };
    //         updatedIngredients[type] = updatedCount;
    //         const priceDeduction = INGREDIENT_PRICES[type];
    //         let newPrice = (this.state.totalPrice - priceDeduction);
    //         newPrice = parseFloat(newPrice.toFixed(2));
    //         this.setState({
    //             ingredients: updatedIngredients,
    //             totalPrice: newPrice
    //         });
    //         this.updatePurchaseState(updatedIngredients);
    //     }
    // }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        
        const queryParams = [];
        for (let i in this.props.ings){
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.props.ings[i]));
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

        if (!this.state.loading && this.props.ings) {
            orderSummary = (
                <OrderSumary ingredients={this.props.ings}
                    cancel={this.purchaseCancelHandler}
                    continue={this.purchaseContinueHandler}
                    price={this.props.price} />
            );
        }

        let burger = <Spinner />;
        if (this.props.ings) {
            burger = (
                <Aux>
                    <h1></h1>
                    <Burger ingredients={this.props.ings} />
                    <BuildControls addIng={this.props.onIngredientAdded} 
                        removeIng={this.props.onIngredientRemoved} 
                        price={this.props.price} 
                        purchasable={this.updatePurchaseState(this.props.ings)} 
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));