export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const assert = (
  condition: unknown,
  status: number,
  message: string,
): asserts condition => {
  if (!condition) {
    throw new ApiError(status, message);
  }
};
