import RecordRow from "./RecordRow";

interface FullRecordRow extends RecordRow {
    category_name: string,
    place_name: string,
    user_name: string
}

export default FullRecordRow;
