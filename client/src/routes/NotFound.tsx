import React from "react";

interface NotFoundProps {
}

interface NotFoundState {
}

class NotFound extends React.Component<NotFoundProps, NotFoundState> {
    public state: NotFoundState = {
    };

    public constructor(props: NotFoundProps | Readonly<NotFoundProps>) {
        super(props);
    }

    public render(): React.ReactNode {
        return (
            <h1>404 Not Found</h1>
        );
    }
}

export default NotFound;
