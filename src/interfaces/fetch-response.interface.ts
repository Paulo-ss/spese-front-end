import { IAPIError } from "./api-error.interface";

export interface IFetchResponse<T> {
  data?: T;
  response?: Response;
  error?: IAPIError;
}
