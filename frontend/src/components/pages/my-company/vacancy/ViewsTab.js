import React from 'react';
import Tab from "../../../tabs/Tab";
import View from "../../../view/View";
import LineChart from "../../../chart/LineChart";
import {formatDate} from "../../../../services/services";

const ViewsTab = ({ groupedViews, chartData }) => {
    return (
        <Tab>
            {chartData?.length > 0 && <LineChart chartData={chartData} />}
            <div className='groupedViews__container'>
                {Object.entries(groupedViews).map(dateViews => {
                    const [date, views] = dateViews;
                    return <div className='view__container'>
                        <h2>{formatDate(date)}</h2>
                        {views?.map(view => (
                            <View {...view}/>
                        ))}
                    </div>
                })}
            </div>
        </Tab>
    );
};

export default ViewsTab;