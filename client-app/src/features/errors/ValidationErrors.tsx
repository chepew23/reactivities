import React from "react";
import { Message } from "semantic-ui-react";

interface Props {
    errors: string[] | null;
}

export default function ValidationErrors({errors}: Props) {
    <Message error>
        { errors && (
            <Message.List>
                { errors.map((error: any, index)  => (
                    <Message.Item key={index}>{ error }</Message.Item>
                )) }
            </Message.List>
        ) }
    </Message>
}