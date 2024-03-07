import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage/index.js"
import FoodPage from "./components/FoodPage/index.js";
import OrderPage from "./components/OrderPage/index.js";
import CheckOrdersPage from "./components/CheckOrdersPage/index.js";
import AdminOrderPage from "./components/AdminOrderPage/index.js";
import CreateFoodPage from "./components/CreateFoodPage/index.js";
import UserFoodOrdersPage from "./components/UserFoodOrdersPage/index.js";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="App">
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/foods">
            <FoodPage />
          </Route>
          <Route exact path="/orders">
            <OrderPage/>
          </Route>
          <Route exact path="/check-orders">
            <CheckOrdersPage/>
          </Route>
          <Route exact path="/admin-orders">
            <AdminOrderPage/>
          </Route>
          <Route exact path="/create-food">
            <CreateFoodPage/>
          </Route>
          <Route exact path="/users/:userId/food-orders">
            <UserFoodOrdersPage/>
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
