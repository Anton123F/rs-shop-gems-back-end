import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";

export const createCatalogBatchBatchProcessFunctionRole = (stack: cdk.Stack, resources: Array<string>) => {
  const role = new iam.Role(stack, 'LambdaImportProductsGemsRole', {
    assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  });

  /**
   * role to allow lambda write inside CloudWatch
   */
  const policy = iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole');
  role.addManagedPolicy(policy);

  role.addToPolicy(new iam.PolicyStatement({
    actions: ['dynamodb:PutItem'],
    resources,
  }));

  return role;
}