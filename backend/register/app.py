from botocore.exceptions import ClientError
import boto3
import os
import logging  
import json

BUCKET = os.environ['BUCKETNAME']
COLLECTION_NAME = os.environ['REKOGNITIONCOLLECTIONNAME']
DYNAMODB_TABLE_NAME = os.environ['DYNAMOTABLENAME']
#LOG_LEVEL = os.environ['LogLevel']
LOG_LEVEL = logging.INFO
#SEND_ANONYMOUS_DATA = os.environ['SendAnonymousData']

dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')
rekognition = boto3.client('rekognition')

logger = logging.getLogger()
logger.setLevel(LOG_LEVEL)


def generate_response(code, result, error):
    return {
        'statusCode': code,
        'headers': {"Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"},
        'body': json.dumps({'result': result, 'error': error})
    }


def lambda_handler(event, context):
    logger.info('Invoked the IndexFace Lambda function.')
    
    data = json.loads(event['body'])
    
    email = data['email']
    firstname = data['firstname']
    lastname = data['lastname']
    company = data['company']
    images = data['images']
    
    logger.info('images = ' + json.dumps(images))
    
    for x in images:
        logger.info('Register a face image to Rekognition.')
        logger.info(x)
        response = rekognition.index_faces(
            Image={
                "S3Object": {
                    "Bucket": BUCKET,
                    "Name": x
                }
            },
            CollectionId=COLLECTION_NAME
        )
        # Register a face image to Rekognition
        if response['ResponseMetadata']['HTTPStatusCode'] != 200 or len(response['FaceRecords']) == 0:
            raise RuntimeError('Fail to register a face to Rekognition.')
        
        faceId = response['FaceRecords'][0]['Face']['FaceId']
        
        # Insert the face data to DynamoDB
        logger.info('Insert the face ID ' + faceId + ' to the DynamoDB table.')
        try:
            response = dynamodb.put_item(
                TableName=DYNAMODB_TABLE_NAME,
                Item={
                    'RekognitionId': {'S': faceId},
                    'FirstName': {'S': firstname},
                    'LastName': {'S': lastname},
                    'Company': {'S': company},
                    'Email': {'S': email}
                }
            )
        except ClientError as err:
            facelist = []
            facelist.append(faceId)
            rekognition.delete_faces(
                CollectionId=COLLECTION_NAME,
                FaceIds=facelist
            )
            return generate_response(400, 'FAIL', 'DYnamoDB error - Error updating DB')
        
        # If the face image was registered successfully, delete the image from s3.
        #s3.delete_object(Bucket=bucket, Key=key)
        logger.info('Registered a face image successfully.')
    return generate_response(200, 'SUCCESS', 'None')
    

    