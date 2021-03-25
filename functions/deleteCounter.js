const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.deleteCounter = async (event, _) => {
  const { pathParameters } = event;
  const decrementCounterParams = {
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
    let queryResult = await dynamoDb.update(decrementCounterParams).promise();
    if (queryResult.Attributes && queryResult.Attributes.count_value <= 0) {
      queryResult = await dynamoDb.delete(dynamoDeleteParams).promise();
    }
    response = {
      statusCode: 200,
      body: JSON.stringify(queryResult.Attributes ? queryResult.Attributes : {}),
    };
  } catch (error) {
    response = { statusCode: 404, body: JSON.stringify('Not found') };
  }
  return response;
};
