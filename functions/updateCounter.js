const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.updateCounter = async (event, context) => {
  const { pathParameters } = event;
  const dynamoParams = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: pathParameters.counterId,
    },
    UpdateExpression: 'set count_value = count_value + :num',
    ConditionExpression: 'id = :counterId',
    ExpressionAttributeValues: {
      ':num': 1,
      ':counterId': pathParameters.counterId,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const result = await dynamoDb.update(dynamoParams).promise();
    response = { statusCode: 200, body: JSON.stringify(result.Attributes) };
  } catch (error) {
    response = { statusCode: 404, body: JSON.stringify('Not found') };
  }
  return response;
};
