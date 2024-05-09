import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import * as messageActions from "../../store/message";
import * as orderActions from "../../store/order";

function AdminOrderPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const orders = useSelector(state => Object.values(state.order.allOrders))

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk())
    }, [dispatch])

    useEffect(() => {
        dispatch(messageActions.getMessages())
    }, [dispatch])

    return (
        <div className='admin-order-page'>
            <div>
                <h1>Admin Order Page</h1>
            </div>
        </div>
    )
}

export default AdminOrderPage
