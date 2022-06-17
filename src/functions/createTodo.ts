import { document } from "src/utils/dynamodbClient";
import dayjs from "dayjs";
import {validate} from 'uuid'
import { uuid } from "uuidv4";
import AWS from "aws-sdk";
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

    const params = {
        Destination: {
        ToAddresses: ['anderson.dasilva@osf.digital'],
        },
        Message: {
        Body: {
            Text: { Data: `Hi there, you created a new Todo with id ${id}` },
        },
        Subject: { Data: 'Todo Creation' },
        },
        Source: 'anderson.dasilva@osf.digital',
    };

    const ses = new AWS.SES();
    await ses.sendEmail(params).promise();
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: JSON.stringify({
        message: "email sent successfully!",
        success: true,
      }),
    };
}