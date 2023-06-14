import React from 'react';
import Tab from "../../../tabs/Tab";
import Response from "../../../../containers/response/Response";
import PieChart from "../../../chart/PieChart";

const ResponsesTab = ({ responses, statistics, setAcceptModalVisible, setRejectModalVisible, setChatModalVisible, setResponseStatus }) => {
    const chartLabels = ['Приглашения', 'Не просмотренные', 'Отказ', 'Просмотренные'];
    const chartData = Object?.values(statistics || {});
    const isCommonResponsesNumberPositive = chartData?.reduce((prev, curr) => {
        prev += curr
        return prev
    }, 0) > 0;

    return (
        <Tab>
            {statistics && isCommonResponsesNumberPositive &&
                <PieChart labels={chartLabels} data={chartData} datasetLabel='Количество откликов'/>}
            {responses?.length > 0 ? responses?.map(response => (
                <Response
                    setAcceptModalVisible={setAcceptModalVisible}
                    setRejectModalVisible={setRejectModalVisible}
                    setChatModalVisible={setChatModalVisible}
                    setResponseStatus={setResponseStatus}
                    {...response}/>
            )) : <div>На эту вакансию пока никто не откликнулся</div>}
        </Tab>
    );
};

export default ResponsesTab;