import UserLevel from "../../objects/enums/UserLevel";
import {Color, Variant} from "react-bootstrap/types";
import Card from "react-bootstrap/Card";
import User from "../../objects/entities/User";

const LevelCard = (props: {level: UserLevel}): JSX.Element => {
    const bgColors: Map<UserLevel, Variant> = new Map([
        [UserLevel.ANONYMOUS, "danger"],
        [UserLevel.REGISTERED, "warning"],
        [UserLevel.PREMIUM, "success"],
        [UserLevel.ADMIN, "dark"]
    ]);
    let text: Color = (props.level === UserLevel.REGISTERED ? "dark" : "white");
    return (
        <Card bg={bgColors.get(props.level)} text={text} className="w-75 mx-auto my-4">
            <Card.Body className="text-center">
                <p className="h6">Tu nivel actual:</p>
                <p className="h4">{User.getLabel(props.level)}</p>
            </Card.Body>
        </Card>
    );
}

export default LevelCard;
