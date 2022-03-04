import { APIGatewayProxyHandler } from "aws-lambda"
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
    const {userId} = event.pathParameters;

    const data = await document.scan({
        TableName: "todos",
        FilterExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
        ":user_id": userId
        }
    }).promise();


    const todos = data.Items;

    if (todos){
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Found Todos",
                todos
            })
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: "There are no To-Do's in the database"
        })
    }
}