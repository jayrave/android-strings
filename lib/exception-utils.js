var MALFORMED_INPUT_EXCEPTION_NAME = "malformed_input";

fun buildMalformedInputException(message) {
  return {
    name: MALFORMED_INPUT_EXCEPTION_NAME,
    message: message
  };
}

fun isMalformedInputException(exception) {
  return (typeof exception === 'object') && (exception.name === MALFORMED_INPUT_EXCEPTION_NAME);
}


module.exports {
  buildMalformedInputException: buildMalformedInputException
  isMalformedInputException: isMalformedInputException
};
