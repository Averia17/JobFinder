import React from 'react';
import Input from "../inputs/Input";

const ResumeForm = () => {
    return (
        <form>
            <div>
                <h4>Contact info</h4>
                <label htmlFor='name'>Name</label>
                <Input type='text' name='name'/>
                <label htmlFor='surname'>Surname</label>
                <Input type='text' name='surname'/>
                <label htmlFor='city'>City</label>
                <select name='city'>
                    <option value='Minsk'>Minsk</option>
                </select>
            </div>
            <div>
                <h4>Main info</h4>
                <label htmlFor='birthdate'>Birthdate</label>
                <Input type='text' name='birthdate'/>
                <label htmlFor='sex'>Sex</label>
                <input name='sex' type='radio' value='female'/>
                <input name='sex' type='radio' value='male'/>
                <label htmlFor='experience'>Experience</label>
                <input name='experience' type='radio' value={true}/>
                <input name='experience' type='radio' value={false}/>
            </div>
            <input type='submit'/>
        </form>
    );
};

export default ResumeForm;