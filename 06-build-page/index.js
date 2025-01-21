const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const assetsDir = path.join(__dirname, 'assets');
const assetsCopyDir = path.join(projectDist, 'assets');
const stylesDir = path.join(__dirname, 'styles');
const componentsDir = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');
const outputHtmlFile = path.join(projectDist, 'index.html');
const outputCssFile = path.join(projectDist, 'style.css');

function createProjectDist() {
  fs.mkdir(projectDist, { recursive: true }, (err) => {
    if (err) console.error('Error while creating a folder project-dist:', err.message);
    else {
      console.log('Folder project-dist created.');
      copyAssets();
      mergeStyles();
      buildHtml();
    }
  });
}

function copyAssets() {
  fs.rm(assetsCopyDir, { recursive: true, force: true }, () => {
    fs.mkdir(assetsCopyDir, { recursive: true }, (err) => {
      if (err) console.error('Error while creating folder assets:', err.message);
      else {
        copyDirectory(assetsDir, assetsCopyDir);
        console.log('Folder assets copied.');
      }
    });
  });
}

function copyDirectory(source, destination) {
  fs.readdir(source, { withFileTypes: true }, (err, items) => {
    if (err) console.error('Error while reading the directory:', err.message);
    else {
      items.forEach((item) => {
        const sourcePath = path.join(source, item.name);
        const destPath = path.join(destination, item.name);

        if (item.isDirectory()) {
          fs.mkdir(destPath, { recursive: true }, (err) => {
            if (err) console.error('Error while creating a folder:', err.message);
            else copyDirectory(sourcePath, destPath);
          });
        } else {
          fs.copyFile(sourcePath, destPath, (err) => {
            if (err) console.error('Error while copying the file:', err.message);
          });
        }
      });
    }
  });
}

function mergeStyles() {
  const output = fs.createWriteStream(outputCssFile);

  fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
    if (err) console.error('Error while reading styles:', err.message);
    else {
      const cssFiles = files.filter((file) => file.isFile() && path.extname(file.name) === '.css');
      cssFiles.forEach((file, index) => {
        const filePath = path.join(stylesDir, file.name);
        fs.readFile(filePath, 'utf-8', (err, data) => {
          if (err) console.error(`Error while reading the file "${file.name}":`, err.message);
          else {
            output.write(data + '\n');
            if (index === cssFiles.length - 1) {
              console.log('File style.css created.');
            }
          }
        });
      });
    }
  });
}

function buildHtml() {
  fs.readFile(templateFile, 'utf-8', (err, template) => {
    if (err) console.error('Error while reading template.html:', err.message);
    else {
      fs.readdir(componentsDir, { withFileTypes: true }, (err, files) => {
        if (err) console.error('Error while reading components directory:', err.message);
        else {
          const components = files.filter(
            (file) => file.isFile() && path.extname(file.name) === '.html'
          );
          let html = template;

          components.forEach((component, index) => {
            const componentName = path.parse(component.name).name;
            const componentPath = path.join(componentsDir, component.name);

            fs.readFile(componentPath, 'utf-8', (err, data) => {
              if (err) console.error(`Error while reading component "${component.name}":`, err.message);
              else {
                html = html.replace(`{{${componentName}}}`, data);

                if (index === components.length - 1) {
                  fs.writeFile(outputHtmlFile, html, (err) => {
                    if (err) console.error('Error while copying index.html:', err.message);
                    else console.log('File index.html created.');
                  });
                }
              }
            });
          });
        }
      });
    }
  });
}

createProjectDist();