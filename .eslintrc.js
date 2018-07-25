module.exports = {
    "ecmaFeatures": {
        "jsx": true,
        "arrowFunctions": true,
        "blockBindings": true,
        "defaultParams": true,
        "destructuring": true,
        "forOf": true,
        "generators": true,
        "objectLiteralComputedProperties": true,
        "objectLiteralShorthandMethods": true,
        "objectLiteralShorthandProperties": true,
        "restParams": true,
        "spread": true,
        "templateStrings": true,
        "modules": true,
        "classes": true
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
    "brace-style": 2,
    "camelcase": 2,
    "comma-dangle": [2, "never"],
    "comma-spacing": [2, { "before": false, "after": true }],
    "comma-style": [2, "last"],
    "complexity": [1, 8],
    "consistent-this": [2, "_this"],
    "curly": 2,
    "default-case": 2,
    "dot-notation": 2,
    "eol-last": 2,
    "eqeqeq": 2,
    "guard-for-in": 1,
    "indent": [2, 2, { "SwitchCase": 1 }],
    "jsx-quotes": [2, "prefer-single"],
    "key-spacing": [2, { "beforeColon": false,
                         "afterColon": true }],
    "new-cap": 2,
    "new-parens": 2,
    "no-caller": 2,
    "no-debugger": 1,
    "no-dupe-args": 2,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-eq-null": 0,
    "no-eval": 2,
    "no-implied-eval": 2,
    "no-invalid-regexp": 2,
    "no-mixed-spaces-and-tabs": 2,
    "no-redeclare": 2,
    "quote-props": [2, "consistent-as-needed"],
    "no-self-compare": 1,
    "no-shadow-restricted-names": 2,
    "no-trailing-spaces": 2,
    "no-undef": 2,
    "no-undef-init": 2,
    "no-underscore-dangle": 0,
    "no-unreachable": 2,
    "no-unused-vars": 1,
    "no-use-before-define": 2,
    "no-with": 2,
    "one-var": [2, "never"],
    "operator-assignment": [2, "always"],
    "quotes": [2, "single"],
    "radix": 2,
    "semi": [2, "always"],
    "semi-spacing": [2, { "before": false, "after": true }],
    "sort-vars": [1, { "ignoreCase": true }],
    "vars-on-top": "error",
    "keyword-spacing": ["error", { "before": true }],
    "space-before-function-paren": [2, {"anonymous": "always", "named": "never"}],
    "space-in-parens": [2, "never"],
    "space-infix-ops": 2,
    "space-unary-ops": [2, { "words": true, "nonwords": false }],
    "strict": [2, "global"],
    "use-isnan": 2,
    "valid-jsdoc": 1,
    "yoda": [2, "never", { "exceptRange": false }]
  }

};
