import React from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom";
import { useDispatch, useSelector, useEffect } from "react-redux";
import * as foodActions from "../../store/food";

export default function LandingPage() {
    const dispatch = useDispatch();
    const [setFoodImgs, setSetFoodImgs] = useState([]);
    useEffect(() => {
        dispatch(foodActions.getAllFoodsThunk());
    }, [dispatch]);
    return (
        <div className="landing-page">
            <h1 >Kapampangan's Best</h1>
            <NavLink exact to="/home">Check out</NavLink>
        </div>
    );
}
