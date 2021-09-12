export interface AppRequest {
  ok: boolean;
}

export interface ErrorRequest extends AppRequest {
  error: {
    message: string;
    name: string;
  }
}
