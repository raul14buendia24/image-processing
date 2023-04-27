// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const sharp = require("sharp");

// defining the Express app
const app = express();
// defining multer to handle mulitpart/form-data requests
const multer  = require('multer')

const PORT = process.env.PORT || 3030;


// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

app.use(express.static('public'));

const upload = multer({ storage: multer.memoryStorage() })

// resize original image post method
app.route('/resize-images')
.post(upload.single('image'), async (req, res,next) => {
    console.log(req.file)
    try {
        
        var metadata = await getMetadata(req.file)
        
        if(metadata.format == 'png') {
          var files = await resizeImagesPng(req.file, req.body.fileName);
          console.log('resize method success');
        } else {
          var files = await resizeImagesJpg(req.file, req.body.fileName);
          console.log('resize method success');
        }

        res.end(JSON.stringify(files));
        
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
    
})


async function getMetadata(image) {
    
  try {
    const metadata = await sharp(image.buffer).metadata();
    return metadata;
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

async function resizeImagesPng(image, fileName) {
  const sharpImage = await sharp(image.buffer)
  var files = []
  var rndString = generateString()
  var originalFileName = fileName + '-' + rndString + '-' + "original.png"
  var mediumFileName = fileName + '-' + rndString + '-' + "md.png"
  var smallFileName = fileName + '-' + rndString + '-' + "sm.png"
  var lowresFileName = fileName + '-' + rndString + '-' + "lowres.png"
  try {
        sharpImage
      .png({ palette: true })
      .resize(1920, 1080, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile("public/images/" + originalFileName);

      files.push(originalFileName)

      sharpImage
      .png({ palette: true })
      .resize(900, 900, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile("public/images/" + mediumFileName);
      files.push(mediumFileName)

        sharpImage
        .png({ palette: true })
        .resize(600, 600, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toFile("public/images/" + smallFileName);
        files.push(smallFileName)

          sharpImage
        .png({ palette: true })
        .resize(300, 300, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toFile("public/images/" + lowresFileName);
        files.push(lowresFileName)

      return files

    } catch (error) {
      return error
      console.log(error, 'png method');
    }
}

async function resizeImagesJpg(image, fileName) {
  const sharpImage = await sharp(image.buffer)
  var files = []
  var rndString = generateString()
  var originalFileName = fileName + '-' + rndString + '-' + "original.jpg"
  var mediumFileName = fileName + '-' + rndString + '-' + "md.jpg"
  var smallFileName = fileName + '-' + rndString + '-' + "sm.jpg"
  var lowresFileName = fileName + '-' + rndString + '-' + "lowres.jpg"
  
  try {
        sharpImage
      .resize(1920, 1080, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile("public/images/" + originalFileName);
      files.push(originalFileName)

      sharpImage
      .resize(900, 900, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile("public/images/" + mediumFileName);
      files.push(mediumFileName)

      sharpImage
      .resize(600, 600, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile("public/images/" + smallFileName);
      files.push(smallFileName)

      sharpImage
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile("public/images/" + lowresFileName);
      files.push(lowresFileName)

      return files

    } catch (error) {
      return error
      console.log(error, 'jpg method');
    }
}


  function generateString() {
    const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = 5;
    for ( let i = 0; i < 5; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.trim();
}

// starting the server
/*app.listen(3001, () => {
  console.log('listening on port 3001');
});*/
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});