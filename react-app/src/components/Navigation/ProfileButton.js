import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { logout } from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import UserFoodOrdersPage from "../UserFoodOrdersPage";
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const history = useHistory();
  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };
  console.log('user: ', user)
  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const handleOrderButton = (e) => {
    e.preventDefault();
    history.push('/orders')
    setShowMenu(false);
  }

  const handleCreateFood = (e) => {
    e.preventDefault();
    history.push('/create-food')
    setShowMenu(false);
  }

  const handleCartButton = (e) => {
    e.preventDefault();
    history.push(`/users/${user.id}/food-orders`)
    setShowMenu(false);
  }
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
  const closeMenu = () => setShowMenu(false);

  return (
    <div className="profile-button-container">
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="profile-dropdown">
            <div className="profile-dropdown-content">
              <div>
              <li className="profile-username">{user.username}</li>
              <li className="profile-email">{user.email}</li>
              <li className="profile-logout"><button onClick={handleLogout}>Log Out</button>
              </li>
            </div>
            <div className="profile-dropdown-buttons">
              <div className="view-orders-button">
                <button onClick={handleOrderButton}>View Orders</button>
              </div>
              <div className="view-cart-button">
                <button onClick={handleCartButton}>View Cart</button>
              </div>
              {user?.isAdmin && (
                <div className="create-food-button">
                  <button onClick={handleCreateFood}>Create Food</button>
                </div>
              )}
            </div>
            </div>
          </div>
        ) : (
          <div>
            <OpenModalButton
              buttonText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />

            <OpenModalButton
              buttonText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
