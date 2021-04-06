/**
 * Functions to interact with AWS services.
 * Also operates as the AWS param config file, since
 * it is the only point of contact with AWS services.
 */


// Initialize the Amazon Cognito credentials provider
// AWS.config.region = 'us-west-2'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-west-2:68d97040-eb10-4d2c-92b8-7b3e60831dc4',
// });
// var docClient = new AWS.DynamoDB.DocumentClient()

DATA_DICT = []

/**
 * Collects the data associated with a ticker from AWS.
 *
 * @param ticker The 3-letter ticker for a coin.
 * @return an array of pairs [date,close].
 */
async function getCoin(ticker) {
    ticker = ticker.toUpperCase();
    if(DATA_DICT[ticker] != null) {
        return DATA_DICT[ticker];
    }
    
    const response = await fetch(`https://81qzzh4uzl.execute-api.us-east-1.amazonaws.com/call/market?coin=${ticker}&count=2000`,
                                 {
                                     method: 'POST',
                                     mode: 'cors',
                                     cache: 'no-cache'
                                 }
                                );
    DATA_DICT[ticker] = response.json();
    return DATA_DICT[ticker];
}
