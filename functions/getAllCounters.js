const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.getAllCounters = async (event, context) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
  };
  try {
    const result = await dynamoDb.scan(params).promise();
    response = {
      statusCode: 200,
      body: JSON.stringify(result.Count ? result.Items : []),
    };
  } catch (error) {
    response = { statusCode: 500 };
  }
  return response;
};
