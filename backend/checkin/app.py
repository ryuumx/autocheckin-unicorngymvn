#!/usr/bin/python
# -*- coding: utf-8 -*-
##############################################################################
#  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.   #
#                                                                            #
#  Licensed under the Amazon Software License (the "License"). You may not   #
#  use this file except in compliance with the License. A copy of the        #
#  License is located at                                                     #
#                                                                            #
#      http://aws.amazon.com/asl/                                            #
#                                                                            #
#  or in the "license" file accompanying this file. This file is distributed #
#  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,        #
#  express or implied. See the License for the specific language governing   #
#  permissions and limitations under the License.                            #
##############################################################################
from botocore.exceptions import ClientError
import boto3
import os
import logging
import base64
import json
import time

BUCKET = os.environ['BUCKETNAME']
REKOGNITION_FACE_SIMILARITY_THRESHOLD = int(os.environ['REKOGNITIONFACESIMILARITYTHRESHOLD'])
COLLECTION_ID = os.environ['REKOGNITIONCOLLECTIONNAME']
DYNAMODB_TABLE_NAME = os.environ['DYNAMOTABLENAME']
LOG_LEVEL = logging.INFO
#SEND_ANONYMOUS_DATA = os.environ['SendAnonymousData']

dynamodb = boto3.client('dynamodb')
rekognition = boto3.client('rekognition')

logger = logging.getLogger()
logger.setLevel(LOG_LEVEL)


def generate_response(code, result, error, firstname, lastname, percentage):
    return {
        'statusCode': code,
        'headers': {"Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"},
        'body': json.dumps({'result': result, 'error': error, 'firstname': firstname, 'lastname': lastname, 'percentage' : percentage})
    }

def update_item(face_id, similarity):
    ts = int(time.time())
    dynamodb.update_item(
        TableName=DYNAMODB_TABLE_NAME,
        Key={'RekognitionId': {'S': face_id}},
        UpdateExpression="SET GatePassed = :ts",
        ExpressionAttributeValues={':ts':{'S': str(ts)}}
        )

def lambda_handler(event, context):
    # logger.info(event)
    binary_image = base64.b64decode(event['body']) # get the image in request body

    try:
        try:
            # Search for image in the specified Rekognition collection
            response = rekognition.search_faces_by_image(
                CollectionId=COLLECTION_ID,
                Image={'Bytes': binary_image},
                FaceMatchThreshold=REKOGNITION_FACE_SIMILARITY_THRESHOLD,
                MaxFaces=1
            )

        except ClientError as err:
            code = err.response['Error']['Code']
            if code in ['ProvisionedThroughputExceededException', 'ThrottlingException']:
                logger.exception()
            elif code in ['InvalidParameterException']:
                logger.info('No face in Rekognition')
            else:
                logger.exception(err)
            return generate_response(400, 'FAIL', 'Rekogntion error - Unable to find face', '', '', 0)

        # found similar face
        face_matches = response['FaceMatches']
        if len(face_matches) > 0:
            face_match = face_matches[0]
            similarity = face_match['Similarity']
            face = face_match['Face']
            face_id = face['FaceId']

            try:
                # search and update DynamoDB table
                response = dynamodb.get_item(
                    TableName=DYNAMODB_TABLE_NAME,
                    Key={'RekognitionId': {'S': face_id}}
                )
                
                logger.info(json.dumps(response))
                
                firstname = response['Item']['FirstName']['S']
                lastname = response['Item']['LastName']['S']
                company = response['Item']['Company']['S']
                email = response['Item']['Email']['S']
                
                update_item(face_id, similarity)
            except Exception as err:
                logger.exception(err)
                return generate_response(400, 'FAIL', 'DynamoDB error - Unable to querry DB', '', '', 0)

            logger.info('Above Rekognition Threshold. Similarity: {}'.format(similarity))
            return generate_response(200, 'SUCCESS', 'None', firstname, lastname, similarity)

        else:
            logger.info('Similar Faces Not Found')
            return generate_response(400, 'FAIL', 'Rekogntion error - No matching face', '', '', 0)

    except Exception as err:
        logger.exception(err)
        return generate_response(400, 'FAIL', 'Unable to find similar face', '', '', 0)
