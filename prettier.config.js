module.exports = {
    printWidth: 80,
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    formatOnSave: true,
    semi: true,
    bracketSpacing: true,
    arrowParens: "always",
    endOfLine: "lf",
    overrides: [
        {
            files: "*.json",
            options: {
                tabWidth: 2
            }
        }
    ]
};
