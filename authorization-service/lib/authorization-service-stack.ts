import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {createBasicAuthorizerFunction} from "../lambda/basicAuthorizerFunction";

import {config} from 'dotenv';
import {resolve} from 'path';

config({path: resolve(__dirname, '../.env')});

const login = process.env.LOGIN;
const password = process.env.PASSWORD;

const DEFAULT_ENV = {
  [login as string]: password
}
export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //@ts-ignore
    const _basicAuthorizerFunction = createBasicAuthorizerFunction(this, DEFAULT_ENV);

    //use to export value to another Stack application
    new cdk.CfnOutput(this, 'basicAuthorizerFunction',
      {
        value: _basicAuthorizerFunction.functionArn,
        exportName: 'BasicAuthorizerFunctionArn'
      });
  }
}
