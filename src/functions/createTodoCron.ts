import { document } from "src/utils/dynamodbClient";
import { uuid } from "uuidv4";
import { faker } from '@faker-js/faker';

export const handle = async (event) => {

    const userId = uuid();
    const id = uuid();

    await document
    .put({
        TableName: "todos",
        Item: {
        id,
        user_id: userId,
        title: faker.lorem.paragraph(),
        done: false,
        deadline: faker.date.future()
        },
    })
    .promise();

}