import boto3
import json
import os
import logging


rekognition = boto3.client('rekognition')
COLLECTION_NAME = os.environ['REKOGNITIONCOLLECTIONNAME']

def generate_response(result):
    return {
        'statusCode': result['ResponseMetadata']['HTTPStatusCode'],
        'headers': {"Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"},
        'body': json.dumps({'CollectionARN': result['CollectionArn'], 'FaceModelVersion': result['FaceModelVersion']})
    }

def lambda_handler(event, context):
    
    ret = rekognition.create_collection(CollectionId=COLLECTION_NAME)

    print(ret)
    return generate_response(ret)