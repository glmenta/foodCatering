import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './fooddetail.css'


function FoodDetailModal({ isOpen, onClose, foodId }) {
    const dispatch = useDispatch();
    const food = useSelector(state => state.food[foodId]);


    return (
        <div>

        </div>
    )
}
