export interface IStatement {
  Action: string | null;
  Effect: string | null;
  Resource: string | null;
}
export interface IPolicyDocument {
  Version: string | null;
  Statement: Array<IStatement> | null;
}
export interface IAuthResponse {
  principalId: string | null;
  policyDocument: IPolicyDocument | null;
  context?: {
    [key: string]: string | number | boolean;
  };
}