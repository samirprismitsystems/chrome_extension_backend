class utils {
  static demo() {
    return "hello world";
  }

  static getResponse(isError?: boolean, data?: any, message?: string) {
    if (isError) {
      return {
        isError: true,
        data: [],
        message: message || "Internal server error!",
      };
    } else {
      return {
        isError: false,
        data: data || [],
        message: message || "Internal server error!",
      };
    }
  }
}

export default utils;
