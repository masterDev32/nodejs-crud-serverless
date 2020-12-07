const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.getSingleCounter = async (event, context) => {
  const { pathParameters } = event;
  const dynamoParams = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: pathParameters.counterId,
    },
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': pathParameters.counterId,
    },
  };

  try {
    const result = await dynamoDb.query(dynamoParams).promise();
    response = {
      statusCode: 200,
      body: JSON.stringify(result && result.Count ? result.Items[0] : {}),
    };
  } catch (error) {
    response = { statusCode: 404, body: JSON.stringify('Not found') };
  }
  return response;
};
