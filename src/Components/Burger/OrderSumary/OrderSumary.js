import React from 'react';

import Aux from '../../../Hoc/AuxComponent';
import Button from '../../UI/Button/Button';

class OrderSummary extends React.Component {

    componentWillUpdate() {
        console.log('[OrderSummary] WillUpdate');
    }

    render() {
        const ingredientSumary = Object.keys(this.props.ingredients)
            .map(igKey => {
                return <li key={igKey}><span style={{ textTransform: 'capitalize' }}>{igKey}</span>: {this.props.ingredients[igKey]}</li>
            });
        return (
            <Aux>
                <h3>Your Order</h3>
                <p>A delicious burger with following ingredients: </p>
                <ul>
                    {ingredientSumary}
                </ul>
                <p><strong>Total Price: {this.props.price}</strong></p>
                <p>Continue to checkout?</p>
                <Button btnType="Danger" clicked={this.props.cancel}>CANCEL</Button>
                <Button btnType="Success" clicked={this.props.continue}>CONTINUE</Button>
            </Aux>
        );
    }
}

export default OrderSummary;

