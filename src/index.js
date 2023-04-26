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
app.route('/resize-original')
.post( upload.single('image'), async (req, res,next) => {
    //console.log(req.file)
    try {
        
        var metadata = await getMetadata(req.file)
        
        if(metadata.format == 'png') {
          var rezisedImage = await resizeImageOriginalpng(req.file);
          console.log('resize method success');
        } else {
          var rezisedImage = await resizeImageOriginal(req.file);
          console.log('resize method success');
        }

        var filePath = path.join(__dirname, '..', rezisedImage)
        res.end(filePath);
        
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

async function getMetadataResized() {
    const sharpImage = await sharp('resized-image.png')
  try {
    const metadata = await sharpImage.metadata();
    //const stats = await sharp(image).stats();
    return metadata;
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

async function resizeImageOriginalpng(image) {
  const sharpImage = await sharp(image.buffer)
  
  try {
        sharpImage
      .png({ palette: true })
      .resize(1920, 1080, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile("resized-image.png");

      return 'resized-image.png'

    } catch (error) {
      return error
      console.log(error, 'png method');
    }
}

async function resizeImageOriginal(image) {
  console.log(image)
  const sharpImage = await sharp(image.buffer)
  
  try {
        sharpImage
      .resize(1920, 1080, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      }).toFile("resized-image.jpg");

      return 'resized-image.png'

    } catch (error) {
      return error
      console.log(error, 'jpg method');
    }
}


async function resizeImage() {
    const sharpImage = await sharp("javascript.png")
    
    try {
        sharpImage
      .png({ palette: true })
      .resize(900, 900, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
        .toFile("big-png-image-md.png");
    
        sharpImage
        .png({ palette: true })
        .resize(600, 600, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
          .toFile("big-png-image-sm.png");

          sharpImage
        .png({ palette: true })
        .resize(300, 300, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
          .toFile("big-png-image-lowres.png");
     
          sharpImage
        .png({ palette: true })
        .resize(1920, 1080, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
          .toFile("big-png-image-original.png");
      } catch (error) {
        console.log(error);
      }
  }

  //resizeImage();



// starting the server
/*app.listen(3001, () => {
  console.log('listening on port 3001');
});*/
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});