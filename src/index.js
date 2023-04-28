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

app.route('/return-file-original')
.post(upload.single('image'), async (req, res,next) => {
    console.log(req.file)
    
        if(req.file.mimetype == 'image/png') {
        
          const { info, data } = await sharp(req.file.buffer)
          .png({ palette: true })
          .resize({
            width: 1920,
            height: 1080,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })

          const base64String = base64ArrayBuffer(data.buffer);
          res.send(base64String);
          
        } else {
          const { info, data } = await sharp(req.file.buffer)
          .resize({
            width: 1920,
            height: 1080,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })
      
          const base64String = base64ArrayBuffer(data.buffer);  
          res.send(base64String);
          
        }
})

app.route('/return-file-md')
.post(upload.single('image'), async (req, res,next) => {
    console.log(req.file)
    
        if(req.file.mimetype == 'image/png') {
        
          const { info, data } = await sharp(req.file.buffer)
          .png({ palette: true })
          .resize({
            width: 900,
            height: 900,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })

          const base64String = base64ArrayBuffer(data.buffer);
          res.send(base64String);
          
        } else {
          const { info, data } = await sharp(req.file.buffer)
          .resize({
            width: 900,
            height: 900,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })
      
          const base64String = base64ArrayBuffer(data.buffer);  
          res.send(base64String);
          
        }
})

app.route('/return-file-sm')
.post(upload.single('image'), async (req, res,next) => {
    console.log(req.file)
    
        if(req.file.mimetype == 'image/png') {
        
          const { info, data } = await sharp(req.file.buffer)
          .png({ palette: true })
          .resize({
            width: 600,
            height: 600,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })

          const base64String = base64ArrayBuffer(data.buffer);
          res.send(base64String);
          
        } else {
          const { info, data } = await sharp(req.file.buffer)
          .resize({
            width: 600,
            height: 600,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })
      
          const base64String = base64ArrayBuffer(data.buffer);  
          res.send(base64String);
          
        }
})

app.route('/return-file-low')
.post(upload.single('image'), async (req, res,next) => {
    console.log(req.file)
    
        if(req.file.mimetype == 'image/png') {
        
          const { info, data } = await sharp(req.file.buffer)
          .png({ palette: true })
          .resize({
            width: 300,
            height: 300,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })

          const base64String = base64ArrayBuffer(data.buffer);
          res.send(base64String);
          
        } else {
          const { info, data } = await sharp(req.file.buffer)
          .resize({
            width: 300,
            height: 300,
            fit: sharp.fit.inside,
            withoutEnlargement: true
          })
          .toBuffer({ resolveWithObject: true })
      
          const base64String = base64ArrayBuffer(data.buffer);  
          res.send(base64String);
          
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

      var saved = files.push(originalFileName)

      sharpImage
      .png({ palette: true })
      .resize(900, 900, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile("public/images/" + mediumFileName);
      var saved = files.push(mediumFileName)

        sharpImage
        .png({ palette: true })
        .resize(600, 600, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toFile("public/images/" + smallFileName);
        var saved = files.push(smallFileName)

          sharpImage
        .png({ palette: true })
        .resize(300, 300, {
          fit: sharp.fit.inside,
          withoutEnlargement: true
        })
        .toFile("public/images/" + lowresFileName);
        var saved = files.push(lowresFileName)

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


function base64ArrayBuffer(arrayBuffer) {
  var base64    = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes         = new Uint8Array(arrayBuffer)
  var byteLength    = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength    = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048)   >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032)     >>  6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63               // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3)   << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008)  >>  4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15)    <<  2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }
  
  return base64
}

// starting the server
/*app.listen(3001, () => {
  console.log('listening on port 3001');
});*/
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});