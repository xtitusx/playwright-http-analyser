module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2017, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier"
  ],
  rules: { // https://www.npmjs.com/package/tslint-eslint-rules
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "curly": "warn", // specify curly brace conventions for all control statements
    "eqeqeq": "warn", // require the use of === and !==
    "@typescript-eslint/interface-name-prefix" : "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars" : "off",
    "@typescript-eslint/array-type": ['warn', {default: 'array-simple'}],
    '@typescript-eslint/no-var-requires': 0
  }
};