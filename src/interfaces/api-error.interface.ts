export interface IAPIError {
  statusCode: number;
  errorMessage: string | string[];
  timestamp: string;
  path: string;
}
