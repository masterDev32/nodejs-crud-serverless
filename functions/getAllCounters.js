const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.getAllCounters = async (_, _) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
  };
  try {
    const queryResult = await dynamoDb.scan(params).promise();
    response = {
      statusCode: 200,
      body: JSON.stringify(queryResult.Count ? queryResult.Items : []),
    };
  } catch (error) {
    response = { statusCode: 500 };
  }
  return response;
};
