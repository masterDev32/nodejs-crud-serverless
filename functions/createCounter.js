const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
let response;

exports.createCounter = async (event, _) => {
  const { body } = JSON.parse(JSON.stringify(event));
  const counterObj = Object.assign({ id: uuidv4() }, JSON.parse(body));
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: counterObj,
  };

  try {
    await dynamoDb.put(params).promise();
    response = { statusCode: 200, body: JSON.stringify(counterObj) };
  } catch (error) {
    response = { statusCode: 500 };
  }
  return response;
};
