import React from 'react';
import heart from '../../assets/heart.png'
import filledHeart from '../../assets/filledHeart.png'
import './style.css'

const FavoriteButton = ({ is_favorite, onClick }) => {
    return (
        <button className='favoriteButton__container' onClick={onClick}>
            <img className='favoriteButton__image' src={is_favorite ? filledHeart : heart}/>
        </button>
    );
};

export default FavoriteButton;