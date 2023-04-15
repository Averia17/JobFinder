import React from 'react';
import Tab from "../../../tabs/Tab";
import View from "../../../view/View";

const ViewsTab = ({ views }) => {
    return (
        <Tab>
            {views.map(view => (
                <View {...view}/>
            ))}
        </Tab>
    );
};

export default ViewsTab;