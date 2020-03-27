## Auto Check-In Application

#### Architecture
![Architecture Diagram](/architecture.jpeg)

#### Backend
*Sources*
Can be found in:
```bash
./backend
```

*Manual deployment guide*
- Deploy each respective folder/function to a Lambda function, with permissions to S3 bucket and Rekognition
- Deploy API Gateway with 3 endpoints associating with the functions:
    * checkin (allow OPTIONS & POST)
    * register (allow OPTIONS & POST)
    * uploadlink (allow OPTIONS & GET)
- If neccessary, allow CORS

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
