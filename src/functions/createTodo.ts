import { document } from "src/utils/dynamodbClient";
import dayjs from "dayjs";
import {validate} from 'uuid'
import { uuid } from "uuidv4";


interface ICreateTodoDTO {
    id: string;
    title: string;
    deadline: Date
}

export const handle = async (event) => {
    const { userId } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as ICreateTodoDTO;

    const id = uuid();

    // User ID must be a valid UUID: https://www.uuidgenerator.net/version4
    if (!validate(userId)) return { statusCode: 400 };

    await document
    .put({
        TableName: "todos",
        Item: {
        id,
        user_id: userId,
        title,
        done: false,
        deadline: dayjs(deadline).toDate()
        },
    })
    .promise();
    
    return {
        statusCode: 201
    };
}