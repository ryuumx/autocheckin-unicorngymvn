## Auto Check-In Application

#### Architecture
![Architecture Diagram](/architecture.jpeg)

#### Backend
*Sources*
Can be found in:
```bash
./backend
```

*Deployment guide*
- Prerequisites:
    * Install SAM CLI from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
- Change to Backend folder
- Edit template.yaml and change the following parameters:
    * BUCKETNAME
    * REKOGNITIONCOLLECTIONNAME
    * DYNAMOTABLENAME
    * REKOGNITIONFACESIMILARITYTHRESHOLD
- Create the respective services:
    * S3 bucket (to store uploaded images)
    * DynamoDB table
- Run commands:
    ```bash
    sam build
    sam deploy --guided
    ```
- Make sure the following settings are set correctly:
    * RegisterFunction has access to S3, DynamoDB, Rekognition
    * CheckInFunction has access to DynamoDB, Rekognition
    * CreateCollectionFunction has access to Rekognition
- Invoke CreateCollectionFunction to create Rekognition collection

#### Frontend
*Sources*
Can be found in:
```bash
./frontend
```

*Deployment guide*
- Have nodejs & npm installed
- Navigate to the frontend folder & run:
    ```bash
    $ npm install
    ```
- To run locally (at localhost:8080):
    ```bash
    $ npm start
    ```
- To deploy to S3/CloudFront, run:
    ```bash
    $ npm run build
    ```
    And deploy:
    ```bash
    ./frontend/dist
    ```
- Update:
    ```bash
    ./frontend/src/webpack.config.js
    ```
    To reflect backend endpoint

#### Infrastructure
TBD
