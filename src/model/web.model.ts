export class WebResponse<T> {
  status: string;
  code: number;
  data?: T;
  errors?: string;
}
