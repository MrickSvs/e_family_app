const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '../assets/evaneos.png');
const outputPath = path.join(__dirname, '../assets/splash.png');

console.log('Starting splash screen generation...');
console.log('Input path:', inputPath);
console.log('Output path:', outputPath);

// Vérifier si le fichier d'entrée existe
if (!fs.existsSync(inputPath)) {
  console.error('ERROR: Input file does not exist:', inputPath);
  process.exit(1);
}

console.log('Input file exists, processing...');

// Afficher les informations sur l'image d'entrée
sharp(inputPath)
  .metadata()
  .then(metadata => {
    console.log('Input image metadata:', metadata);
  })
  .catch(err => {
    console.error('Error reading input image metadata:', err);
  });

sharp(inputPath)
  .resize({
    width: 800,  // Doubler la taille du logo
    height: 800,
    fit: 'contain',
    background: { r: 15, g: 128, b: 102, alpha: 1 } // #0f8066
  })
  .toFormat('png', { quality: 100 })
  .toBuffer()
  .then(buffer => {
    console.log('Logo resized successfully, creating background...');
    // Créer une image de fond plus grande avec le logo centré
    return sharp({
      create: {
        width: 1242,  // Taille recommandée pour iOS
        height: 2436,
        channels: 4,
        background: { r: 15, g: 128, b: 102, alpha: 1 }
      }
    })
    .composite([
      {
        input: buffer,
        gravity: 'center'
      }
    ])
    .toFile(outputPath);
  })
  .then(info => {
    console.log('Splash screen created successfully:', info);
    
    // Vérifier si le fichier de sortie existe et afficher sa taille
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      console.log('Output file size:', stats.size, 'bytes');
      console.log('Output file created at:', outputPath);
    } else {
      console.error('WARNING: Output file was not created');
    }
  })
  .catch(err => {
    console.error('Error creating splash screen:', err);
  }); 