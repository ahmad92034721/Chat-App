const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dchvkgxqb', 
  api_key: '296971296567722', 
  api_secret: 'c5FoliE9T17wjiNEfoVKvIyuKzY',
});

module.exports = cloudinary;