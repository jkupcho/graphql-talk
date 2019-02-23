const { GraphQLScalarType, Kind } = require("graphql");

exports.DateTime = new GraphQLScalarType({
  name: "DateTime",
  description: "Allows for automatic parsing of a timestamp field",
  serialize: isoString,
  parseValue: isoString,
  parseLiteral(ast) {
    if (ast.kind === Kind.Int) {
      return isoString(ast.value);
    }
    return null;
  }
});

function isoString(value) {
  return new Date(value).toISOString();
}
