import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import * as messageActions from "../../store/message";

function TestPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(sessionActions.getAllUsersThunk())
    }, [dispatch])

    useEffect(() => {
        dispatch(messageActions.getMessages())
    }, [dispatch])

    return (
        <div>
            Test Page
        </div>
    )
}

export default TestPage
