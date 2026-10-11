// build.js - Prepares and publishes files into /wwwroot
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process for Ahmed & Menna Wedding Invitation...');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'wwwroot');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      // Don't copy .git, node_modules, or wwwroot into wwwroot
      if (childItemName === '.git' || childItemName === 'node_modules' || childItemName === 'wwwroot') {
        return;
      }
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Ensure wwwroot exists and copy everything into it
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const itemsToCopy = [
  'index.html',
  'style.css',
  'app.js',
  'music_player.html',
  'countdown.html',
  'guestbook.html',
  'custom_version.html',
  'web.config',
  '_assets'
];

itemsToCopy.forEach((item) => {
  const srcPath = path.join(srcDir, item);
  const destPath = path.join(destDir, item);
  if (fs.existsSync(srcPath)) {
    copyRecursiveSync(srcPath, destPath);
    console.log(`✅ Copied ${item} -> wwwroot/${item}`);
  }
});

console.log('🎉 Build completed successfully! All files published to /wwwroot.');
