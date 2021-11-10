export interface HttpResponse {
  statusCode: number;
  message: string;
  data?: any;
  accesToken?: string;
}
