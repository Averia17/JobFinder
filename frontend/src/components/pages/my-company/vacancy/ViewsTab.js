import React from 'react';
import Tab from "../../../tabs/Tab";
import View from "../../../view/View";
import Chart from "../../../chart/Chart";

const ViewsTab = ({ views }) => {
    return (
        <Tab>
            <Chart/>
            {views.map(view => (
                <View {...view}/>
            ))}
        </Tab>
    );
};

export default ViewsTab;