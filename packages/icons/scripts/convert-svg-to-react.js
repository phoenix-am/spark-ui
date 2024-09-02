const path = require('path');
const fs = require('fs');
const { transform } = require('@svgr/core');
const svgo = require('@svgr/plugin-svgo');
const jsx = require('@svgr/plugin-jsx');

const numberToWord = (num) => {
  const numWords = [
    'Zero', 'One', 'Two', 'Three', 'Four',
    'Five', 'Six', 'Seven', 'Eight', 'Nine',
  ];
  return numWords[num] || num;
};

const toPascalCase = (str) => {
  return str
    .replace(/\s+(.)/g, (_, group1) => group1.toUpperCase())
    .replace(/(\d)/g, (_, num) => numberToWord(num))
    .replace(/[-_](.)/g, (_, group1) => group1.toUpperCase())
    .replace(/^(.)/, (_, group1) => group1.toUpperCase());
};

//#region Base icons
const baseIconsDir = path.resolve(__dirname, '../src/svg/base');
const baseOutDir = path.resolve(__dirname, '../src/icons/base');
const baseIndexPath = path.resolve(baseOutDir, 'index.ts');

if (!fs.existsSync(baseOutDir)) {
  fs.mkdirSync(baseOutDir, { recursive: true });
}

const baseIconsProcessFiles = async (file) => {
  const svgPath = path.join(baseIconsDir, file);
  const svgCode = fs.readFileSync(svgPath, 'utf-8');

  const componentName = toPascalCase(path.basename(file, '.svg'));

  const jsCode = await transform(
    svgCode,
    {
      plugins: [svgo, jsx],
      icon: true,
      typescript: true,
    },
    { componentName }
  );

  const outputPath = path.join(baseOutDir, `${componentName}.tsx`);
  fs.writeFileSync(outputPath, jsCode);

  return `export { default as ${componentName} } from './${componentName}';\n`;
};
//#endregion

//#region Featured icons
const featuredIconsDir = path.resolve(__dirname, '../src/svg/featured');
const featuredOutDir = path.resolve(__dirname, '../src/icons/featured');
const featuredIndexPath = path.resolve(featuredOutDir, 'index.ts');

if (!fs.existsSync(featuredOutDir)) {
  fs.mkdirSync(featuredOutDir, { recursive: true });
}

const featuredIconsProcessFiles = async (file) => {
  const svgPath = path.join(featuredIconsDir, file);
  const svgCode = fs.readFileSync(svgPath, 'utf-8');

  const componentName = toPascalCase(path.basename(file, '.svg'));

  const jsCode = await transform(
    svgCode,
    {
      plugins: [svgo, jsx],
      icon: true,
      typescript: true,
    },
    { componentName }
  );

  const outputPath = path.join(featuredOutDir, `${componentName}.tsx`);
  fs.writeFileSync(outputPath, jsCode);

  return `export { default as ${componentName} } from './${componentName}';\n`;
};
//#endregion

//#region Check icons
const checkIconsDir = path.resolve(__dirname, '../src/svg/check');
const checkOutDir = path.resolve(__dirname, '../src/icons/check');
const checkIndexPath = path.resolve(checkOutDir, 'index.ts');

if (!fs.existsSync(checkOutDir)) {
  fs.mkdirSync(checkOutDir, { recursive: true });
}

const checkIconsProcessFiles = async (file) => {
  const svgPath = path.join(checkIconsDir, file);
  const svgCode = fs.readFileSync(svgPath, 'utf-8');

  const componentName = toPascalCase(path.basename(file, '.svg'));

  const jsCode = await transform(
    svgCode,
    {
      plugins: [svgo, jsx],
      icon: true,
      typescript: true,
    },
    { componentName }
  );

  const outputPath = path.join(checkOutDir, `${componentName}.tsx`);
  fs.writeFileSync(outputPath, jsCode);

  return `export { default as ${componentName} } from './${componentName}';\n`;
};
//#endregion

//#region Payment icons
const paymentIconsDir = path.resolve(__dirname, '../src/svg/payment');
const paymentOutDir = path.resolve(__dirname, '../src/icons/payment');
const paymentIndexPath = path.resolve(paymentOutDir, 'index.ts');

if (!fs.existsSync(paymentOutDir)) {
  fs.mkdirSync(paymentOutDir, { recursive: true });
}

const paymentIconsProcessFiles = async (file) => {
  const svgPath = path.join(paymentIconsDir, file);
  const svgCode = fs.readFileSync(svgPath, 'utf-8');

  const componentName = toPascalCase(path.basename(file, '.svg'));

  const jsCode = await transform(
    svgCode,
    {
      plugins: [svgo, jsx],
      icon: true,
      typescript: true,
    },
    { componentName }
  );

  const outputPath = path.join(paymentOutDir, `${componentName}.tsx`);
  fs.writeFileSync(outputPath, jsCode);

  return `export { default as ${componentName} } from './${componentName}';\n`;
};
//#endregion

//#region Countries icons
const countriesIconsDir = path.resolve(__dirname, '../src/svg/countries');
const countriesOutDir = path.resolve(__dirname, '../src/icons/countries');
const countriesIndexPath = path.resolve(countriesOutDir, 'index.ts');

if (!fs.existsSync(countriesOutDir)) {
  fs.mkdirSync(countriesOutDir, { recursive: true });
}

const countriesIconsProcessFiles = async (file) => {
  const svgPath = path.join(countriesIconsDir, file);
  const svgCode = fs.readFileSync(svgPath, 'utf-8');

  const componentName = toPascalCase(path.basename(file, '.svg'));

  const jsCode = await transform(
    svgCode,
    {
      plugins: [svgo, jsx],
      icon: true,
      typescript: true,
    },
    { componentName }
  );

  const outputPath = path.join(countriesOutDir, `${componentName}.tsx`);
  fs.writeFileSync(outputPath, jsCode);

  return `export { default as ${componentName} } from './${componentName}';\n`;
};
//#endregion

//#region Socials icons
const socialIconsDir = path.resolve(__dirname, '../src/svg/social');
const socialOutDir = path.resolve(__dirname, '../src/icons/social');
const socialIndexPath = path.resolve(socialOutDir, 'index.ts');

if (!fs.existsSync(socialOutDir)) {
  fs.mkdirSync(socialOutDir, { recursive: true });
}

const socialIconsProcessFiles = async (file) => {
  const svgPath = path.join(socialIconsDir, file);
  const svgCode = fs.readFileSync(svgPath, 'utf-8');

  const componentName = toPascalCase(path.basename(file, '.svg'));

  const jsCode = await transform(
    svgCode,
    {
      plugins: [svgo, jsx],
      icon: true,
      typescript: true,
    },
    { componentName }
  );

  const outputPath = path.join(socialOutDir, `${componentName}.tsx`);
  fs.writeFileSync(outputPath, jsCode);

  return `export { default as ${componentName} } from './${componentName}';\n`;
};
//#endregion

const generateIcons = async (iconsDir, files, indexPath) => {
  const svgFiles = fs.readdirSync(iconsDir);
  const exportStatements = await Promise.all(svgFiles.map(files));
  fs.writeFileSync(indexPath, exportStatements.join(''));
  console.log(`Generated index.ts with all icon exports at ${indexPath}`);
};

generateIcons(baseIconsDir, baseIconsProcessFiles, baseIndexPath);
generateIcons(featuredIconsDir, featuredIconsProcessFiles, featuredIndexPath);
generateIcons(checkIconsDir, checkIconsProcessFiles, checkIndexPath);
generateIcons(paymentIconsDir, paymentIconsProcessFiles, paymentIndexPath);
generateIcons(countriesIconsDir, countriesIconsProcessFiles, countriesIndexPath);
generateIcons(socialIconsDir, socialIconsProcessFiles, socialIndexPath);
