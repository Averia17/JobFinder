import React from 'react';
import Button from "./Button";


const ImageButton = (props) => {
    return (
        <Button {...props} type='primary' className='image'>
            <img src={props.src}/>
        </Button>
    );
};

export default ImageButton;