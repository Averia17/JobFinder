import React from 'react';
import Tab from "../../../tabs/Tab";
import Response from "../../../../containers/response/Response";

const ResponsesTab = ({ responses, setAcceptModalVisible, setRejectModalVisible, setChatModalVisible, setResponseStatus }) => {
    return (
        <Tab>
            {responses?.map(response => (
                <Response
                    setAcceptModalVisible={setAcceptModalVisible}
                    setRejectModalVisible={setRejectModalVisible}
                    setChatModalVisible={setChatModalVisible}
                    setResponseStatus={setResponseStatus}
                    {...response}/>
            ))}
        </Tab>
    );
};

export default ResponsesTab;