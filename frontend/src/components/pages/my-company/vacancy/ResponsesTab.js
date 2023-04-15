import React from 'react';
import Tab from "../../../tabs/Tab";
import Response from "../../../response/Response";

const ResponsesTab = ({ responses, setAcceptModalVisible, setRejectModalVisible, setChatModalVisible }) => {
    return (
        <Tab>
            {responses?.map(response => (
                <Response
                    setAcceptModalVisible={setAcceptModalVisible}
                    setRejectModalVisible={setRejectModalVisible}
                    setChatModalVisible={setChatModalVisible}
                    {...response}/>
            ))}
        </Tab>
    );
};

export default ResponsesTab;