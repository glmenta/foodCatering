import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as foodActions from "../../store/food";
// import './createfoodpage.css'

function CreateFoodPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState([]);

    function isValidImageUrl(url) {
        const pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '\\.(jpg|jpeg|png|bmp|gif)(\\?[;&a-z\\d%_.~+=-]*)?$','i');
        return !!pattern.test(url);
    }

    function isOnlyWhitespace(str) {
        return !str.trim().length;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let errors = {};
        if (isOnlyWhitespace(name)) {
            errors.name = "Name cannot be empty";
        }

        if (isOnlyWhitespace(description)) {
            errors.description = "Description cannot be empty";
        }

        if (isOnlyWhitespace(price)) {
            errors.price = "Price cannot be empty";
        }

        if (isOnlyWhitespace(image)) {
            errors.image = "Image cannot be empty";
        }

        if (!isValidImageUrl(image)) {
            errors.image = "Invalid image URL";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const payload = {
            name,
            description,
            price,
            food_img: image
        }
        const data = await dispatch(foodActions.createFoodThunk(payload));
        if (data.errors) {
            setErrors(data.errors);
        } else {
            // const newFoodId = data.id
            setName("")
            setDescription("")
            setPrice(0)
            setImage("")
            setErrors([])
            history.push('/foods')
        }
    };


    return (
        <div className="createfoodpage">
            <form onSubmit={handleSubmit}>
                <h1>Create Food</h1>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Price
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Image
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Create Food</button>
            </form>
        </div>
    )
}

export default CreateFoodPage
