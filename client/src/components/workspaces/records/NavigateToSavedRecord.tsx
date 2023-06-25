import {Navigate} from "react-router-dom";

interface NavigateToSavedRecordProps {
    workspace: number,
    record: number
}

const NavigateToSavedRecord = (props :NavigateToSavedRecordProps): JSX.Element => {
    return <Navigate to={`/workspace/${props.workspace}/records?r=${props.record}&saved`} />;
}

export default NavigateToSavedRecord;
