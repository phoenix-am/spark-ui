module.exports = function (plop) {

  // Define a custom pascalCase helper if needed
  plop.setHelper('pascalCase', (text) => {
    if (typeof text !== 'string') {
      console.error('Invalid input for pascalCase:', text);
      throw new Error('Expected a string input for pascalCase helper');
    }
    return text
      .replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())
      .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
  });

  plop.setGenerator('component', {
    description: 'Generate component files',
    prompts: [
      {
        type: 'input',
        name: 'componentName',
        message: 'What is your component name? ',
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return "component name is required";
        },
      },
    ],
    actions: [
      function customAction(answers) {
        console.log('Debugging: componentName is:', answers.componentName);
        return 'Custom action executed';
      },
      {
        type: 'add',
        path: '../packages/core/src/{{pascalCase componentName}}/{{pascalCase componentName}}.tsx',
        templateFile: './plop-templates/component.hbs'
      },
      {
        type: 'add',
        path: '../packages/core/src/{{pascalCase componentName}}/{{pascalCase componentName}}.types.ts',
        templateFile: './plop-templates/component.types.hbs'
      },
      {
        type: 'add',
        path: '../packages/core/src/{{pascalCase componentName}}/{{pascalCase componentName}}.stories.tsx',
        templateFile: './plop-templates/component.stories.hbs'
      },
      {
        type: 'add',
        path: '../packages/core/src/{{pascalCase componentName}}/{{pascalCase componentName}}.styles.ts',
        templateFile: './plop-templates/component.styles.hbs'
      },
      {
        type: 'add',
        path: '../packages/core/src/{{pascalCase componentName}}/index.ts',
        templateFile: './plop-templates/component.index.hbs'
      },
      {
        type: 'append',
        path: '../packages/core/src/index.ts',
        templateFile: './plop-templates/component.export.hbs',
        separator: '\n'
      },
    ]
  })
}