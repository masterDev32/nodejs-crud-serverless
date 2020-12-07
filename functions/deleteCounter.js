const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.deleteCounter = async (event, context) => {
  const { pathParameters } = event;
  const dynamoParams = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: pathParameters.counterId,
    },
    UpdateExpression: 'set count_value = count_value - :num',
    ConditionExpression: 'id = :counterId',
    ExpressionAttributeValues: {
      ':num': 1,
      ':counterId': pathParameters.counterId,
    },
    ReturnValues: 'ALL_NEW',
  };
  const dynamoDeleteParams = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: pathParameters.counterId,
    },
  };

  try {
    let result = await dynamoDb.update(dynamoParams).promise();
    if (result.Attributes && result.Attributes.count_value <= 0) {
      result = await dynamoDb.delete(dynamoDeleteParams).promise();
    }
    response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes ? result.Attributes : {}),
    };
  } catch (error) {
    response = { statusCode: 404, body: JSON.stringify('Not found') };
  }
  return response;
};
