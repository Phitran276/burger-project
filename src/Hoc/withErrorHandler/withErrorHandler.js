import React, { Component } from 'react';

import Modal from '../../Components/UI/Modal/Modal';

import Aux from '../AuxComponent';

const withErrorHandler = ( WrapperComponent, axios ) => {
    return class extends Component {
        state = {
            error: null
        }

        componentDidMount(){
            this.reqInterceptors = axios.interceptors.request.use(req => {
                this.setState({
                    error: null
                });
                return req;
            });
            this.resInterceptors = axios.interceptors.response.use(res => res, error => {
                this.setState({
                    error: error
                });
            });
        }

        componentWillUnmount() {
            console.log('Will Unmount, remove interceptors', this.reqInterceptors, this.resInterceptors);
            axios.interceptors.request.eject(this.reqInterceptors);
            axios.interceptors.response.eject(this.resInterceptors );
        }

        errorConfirmedHandler = () => {
            this.setState({error: null});
        }

        render() {
            return (
                <Aux>
                    <Modal show={this.state.error} 
                           modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : ''}
                    </Modal>
                    <WrapperComponent {...this.props}/>
                </Aux>
            );
        }
    }
}

export default withErrorHandler;