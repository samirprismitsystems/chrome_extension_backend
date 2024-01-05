class utils {
  static demo() {
    return "hello world";
  }

  // add comments
  static getResponse(isError = false, data = [], message = "Internal server error!") {
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

module.exports = utils;
