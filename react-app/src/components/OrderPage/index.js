import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import OrderDetailModal from "../OrderDetailModal";
import * as sessionActions from "../../store/session";
import * as orderActions from "../../store/order";
import './orderpage.css'

function OrderPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const orders = useSelector(state => Object.values(state.order.currentUserOrders))
    const [isLoaded, setIsLoaded] = useState(false)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [orderId, setOrderId] = useState(null)

    console.log('user: ', user)

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk())
    }, [dispatch])

    useEffect(() => {
        setIsLoaded(false)
        Promise.all([dispatch(orderActions.getUserOrdersThunk(user.id))]).then(() => setIsLoaded(true))
    }, [dispatch])
    // useEffect(() => {
    //     dispatch(orderActions.getUserOrdersThunk(user.id))
    // }, [dispatch])

    console.log('orders: ', orders)

    const openOrderModal = (id) => {
        setOrderId(id)
        setIsOrderModalOpen(true)
    }

    const closeOrderModal = () => {
        setIsOrderModalOpen(false)
        setOrderId(null)
    }

    return (
        <div className='order-page-container'>
            <h1>Order Page</h1>
            <div className='user-orders'>
                {isLoaded && orders.map(order => (
                    <div className='order-card' key={order?.id} onClick={() => openOrderModal(order?.id)}>
                        <div>{order?.id}</div>
                        <div>{order?.order_name}</div>
                        <div>{order?.createdAt}</div>
                    </div>
                ))}
            {isOrderModalOpen && <OrderDetailModal isOpen={isOrderModalOpen} onClose={closeOrderModal} orderId={orderId}/>}
            </div>
        </div>
    )
}

export default OrderPage
