import {IAuthResponse, IPolicyDocument, IStatement} from "./types";

export const handler = async (event: any, context: any, cb: any) => {
  try {
    console.log(`***** Auth Function event *****`);
    console.log(event);

    const token = event.headers.authorization;

    if (!token) {
      console.log(`taken is null or undefined`)
      return cb('Unauthorized'); //401
    }
    const base64Credentials = token.split(' ')[1];

    if (!base64Credentials) {
      console.log(`taken is not in base64Credentials format`)
      throw new Error('Invalid token format');
    }

    const credentials = Buffer.from(base64Credentials, 'base64').toString().split(':');

    if (credentials.length !== 2) {
      console.log(`credentials length !== 2`)
      throw new Error('Invalid credentials format');
    }

    const username = credentials[0];
    const password = credentials[1];
    const storedUserPassword = process.env[username];

    if (!storedUserPassword || storedUserPassword !== password) {
      console.log(`credentials do not match`)
      return cb(null, generatePolicy('user', 'Deny', event.methodArn)); //403
    }

    console.log(`successfully generate Allow policy`);
    return cb(null, generatePolicy('user', 'Allow', event.methodArn));
  } catch (error: any) {
    console.error(`Error in auth function: ${error.message}`);
    return cb(`Error: Invalid token! ${error.message}`);
  }
};
const generatePolicy = function (principalId: string, effect: "Allow" | "Deny", resource: string) {
  const authResponse: IAuthResponse = {
    policyDocument: null,
    principalId: null
  };

  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument: IPolicyDocument = {
      Statement: [],
      Version: ''
    };

    const statementOne: IStatement = {
      Effect: null,
      Action: null,
      Resource: null
    };

    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {};
  return authResponse;
};