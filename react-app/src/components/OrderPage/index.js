import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import * as orderActions from "../../store/order";

function OrderPage() {
    const history = useHistory();
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user)
    const orders = useSelector(state => state.order.allOrders)
    const [isLoaded, setIsLoaded] = useState(false)
    return (
        <div></div>
    )
}

export default OrderPage
