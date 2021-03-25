const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.getSingleCounter = async (event, _) => {
  const { pathParameters } = event;
  const params = {
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
    const queryResult = await dynamoDb.query(params).promise();
    response = {
      statusCode: 200,
      body: JSON.stringify(queryResult && queryResult.Count ? queryResult.Items[0] : {}),
    };
  } catch (error) {
    response = { statusCode: 404, body: JSON.stringify('Not found') };
  }
  return response;
};
