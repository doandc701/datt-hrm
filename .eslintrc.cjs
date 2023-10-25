require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-prettier",
        // "plugin:tailwindcss/recommended",
    ],
    // settings: {
    //   tailwindcss: {
    //     config: "tailwind.config.js",
    //   },
    // },
    overrides: [
        {
            files: [
                "src/global-components/**/*.vue",
                "src/global-components/**/*.js",
            ],
            rules: {
                "vue/multi-word-component-names": 0,
            },
        },
    ],
    rules: {
        "prettier/prettier": [
            "error",
            {
                "endOfLine": "auto"
            }
        ]
        // vue/html-closing-bracket-newline
    },
    parserOptions: {
        ecmaVersion: "latest",
    },
};
