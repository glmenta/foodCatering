import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as foodActions from "../../store/food";

function ManageFoodModal({ isOpen, onClose, foodId }) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [food, setFood] = useState({ name: '', description: '', price: 0 });
    const [imageUrl, setImageUrl] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (foodId) {
            dispatch(foodActions.getFoodThunk(foodId)).then(foodData => {
                setFood(foodData);
                setImages(foodData.food_images || []);
                setIsLoaded(true);
            });
        }
    }, [dispatch, foodId]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFood(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    };

    const handleAddImage = async () => {
        if (imageUrl) {
            const newImage = await dispatch(foodActions.addImageToFoodThunk(foodId, imageUrl));
            setImages([...images, newImage]);
            setImageUrl("");
        }
    };

    const handleDeleteImage = async (imageId) => {
        await dispatch(foodActions.removeImageFromFoodThunk(foodId, imageId));
        setImages(images.filter(image => image.id !== imageId));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (foodId) {
            await dispatch(foodActions.updateFoodThunk(food));
        } else {
            await dispatch(foodActions.createFoodThunk(food));
        }
        onClose();
        await dispatch(foodActions.getAllFoodsThunk());
    };

    const handleDelete = async () => {
        if (foodId) {
            await dispatch(foodActions.deleteFoodThunk(foodId));
            onClose();
            await dispatch(foodActions.getAllFoodsThunk());
        }
    };

    return (
        isOpen &&
        <div className="manage-food-modal">
            <div className="manage-food-modal-content">
                <form onSubmit={handleSubmit}>
                    <label>Name:
                        <input type="text" name="name" value={food.name} onChange={handleChange} />
                    </label>
                    <label>Description:
                        <input type="text" name="description" value={food.description} onChange={handleChange} />
                    </label>
                    <label>Price:
                        <input type="number" name="price" value={food.price} onChange={handleChange} />
                    </label>
                    <button type="submit">Save</button>
                    {foodId && <button type="button" onClick={handleDelete} className="delete-button">Delete</button>}

                    <button type="button" onClick={onClose}>Cancel</button>
                </form>

                <div className="image-management">
                    <label>Add Image URL:
                        <input type="text" value={imageUrl} onChange={handleImageUrlChange} />
                    </label>
                    <button type="button" onClick={handleAddImage}>Add Image</button>

                    <div className="image-list">
                        {images.map(image => (
                            <div key={image.id} className="image-item">
                                <img src={image.url} alt="Food" />
                                <button type="button" onClick={() => handleDeleteImage(image.id)}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageFoodModal;
