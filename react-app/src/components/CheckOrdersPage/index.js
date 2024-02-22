// this component is like the kitchen; admins use this to see the food orders
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as orderActions from '../../store/order';
import * as sessionActions from '../../store/session';
import OrderDetailModal from '../OrderDetailModal';

function CheckOrdersPage() {
    const dispatch = useDispatch();
    const allOrders = useSelector(state => (state.order.allOrders.orders))
    const user = useSelector(state => state.session.user)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [orderId, setOrderId] = useState(null)

    useEffect(() => {
        dispatch(orderActions.getAllOrdersThunk())
    }, [dispatch])

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk())
    }, [dispatch])
    console.log('allOrders: ', allOrders)
    const orders = Array.isArray(allOrders) ? allOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) : [];
    const openOrderModal = (id) => {
        setOrderId(id)
        setIsOrderModalOpen(true)
    }

    const closeOrderModal = () => {
        setIsOrderModalOpen(false)
        setOrderId(null)
    }


    console.log('orders: ', orders)
    console.log('users: ', user)
    return (
        <div className='check-orders-page'>
            {user.isAdmin ? (
                <div>
                <h1>Check Orders</h1>
                <ul>
                    {orders.map(order => (
                        <div>
                            <li key={order.id}>
                                Order Name: {order.order_name}, Created At: {order.createdAt}
                            </li>
                            <button onClick={() => openOrderModal(order?.id)}>
                                View Details
                            </button>

                        </div>
                    ))}
                    {isOrderModalOpen && <OrderDetailModal isOpen={isOrderModalOpen} onClose={closeOrderModal} orderId={orderId}/>}
                    </ul>

            </div>
            )
            : (
                <div>
                    <h1>Unauthorized!</h1>
                </div>
            )}
        </div>
    )
}

export default CheckOrdersPage
