export interface ResponseResultType<D> {
    code: number;
    msg: string;
    data: D;
  }