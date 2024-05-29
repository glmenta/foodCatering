import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as messageActions from '../../store/message';


function UserMessageModal({isOpen, onClose, orderId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const messageHistory = useSelector(state => state.message.userMessages);

    useEffect(() => {
        dispatch(messageActions.getUserMessagesThunk())
    }, [dispatch])

    return (
        <div>
            Message Box
        </div>
    )
}

export default UserMessageModal
