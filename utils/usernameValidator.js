function ValidateInputType(Text) {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      Text
    )
  ) {
    return { email: Text };
  }
  if (/^[a-zA-Z0-9]+$/.test(Text)) {
    return { username: Text };
  }
}

module.exports = ValidateInputType;
