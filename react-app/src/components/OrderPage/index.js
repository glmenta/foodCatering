import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import * as orderActions from "../../store/order";

function OrderPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const orders = useSelector(state => Object.values(state.order.currentUserOrders))
    const [isLoaded, setIsLoaded] = useState(false)
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
    return (
        // isLoaded &&
        <div className='order-page-container'>
            <h1>Order Page</h1>
            <div className='user-orders'>
                {orders.map(order => (
                    <div>
                        <div>{order?.id}</div>
                        <div>{order?.order_name}</div>
                        <div>{order?.createdAt}</div>
                        <div>
                            <button onClick={() => history.push(`/orders/${order?.id}`)}>View Details</button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default OrderPage
