export type ApiResponseSuccess<T> = {
  success: true;
  data: T;
};

export type ApiResponseError = {
  success: false;
  error: {
    message: string;
    code: string;
  };
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
