import React, { Component } from 'react';
import Order from '../../Components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../Hoc/withErrorHandler/withErrorHandler';

class Orders extends Component {

    state = {
        orders: [],
        loading: true
    }

    componentDidMount() {
        axios.get('/orders.json')
            .then(res => {
                const fetchedOrders = [];
                for(let key in res.data){
                    fetchedOrders.push({
                        id: key,
                        ...res.data[key]
                    });
                }
                this.setState({ loading: false, orders: fetchedOrders });
            })
            .catch(err => {
                this.setState({ loading: false });
            })
    }

    render() {
        return (
            <div>
                {this.state.orders.map(order => (
                    <Order key={order.id} price={order.price} ingredients={order.ingredients}/>
                ))}
            </div>
        );
    }
}

export default withErrorHandler(Orders, axios);