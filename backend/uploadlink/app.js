// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

// Generate uuid
const { v4:uuidv4 } = require('uuid');

// Generate S3 presign URL
const AWS = require('aws-sdk');
const s3 = new AWS.S3({signatureVersion: 'v4'});
const bucketName = process.env.BUCKETNAME;

exports.lambdaHandler = async (event, context) => {

    var uuid = uuidv4();
    
    const keyName = uuid.toString();
    const expiration = 60 * 100; // 15 mins

    try {
        var url = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: keyName,
            Expires: expiration
//            ContentType: 'application/octet-stream'
        });

        response = {
            statusCode  : 200,
            headers     : {
                "Access-Control-Allow-Origin": "*"
            },
            body        : JSON.stringify({
                'error' : "NONE",
                'link'  : url
            })
        };
    } catch (err) {
        response = {
            statusCode  : 500,
            headers     : {
                "Access-Control-Allow-Origin": "*"
            },
            body        : JSON.stringify({
                'error' : err.message,
                'link'  : "N/A"
            })
        };
        return response;
    }
    
    return response;
};
