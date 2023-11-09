import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidUrl, getFilePathsFromDirectory} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

    app.get("/filteredimage", async (req: Request, res: Response) => {
      let imageUrl : string


      try {
        if(typeof req.query['image_url'] === 'undefined' || req.query['image_url'].toString().trim().length === 0) {
          return res.status(422).send("Missing Image URL")
        }
        imageUrl = new URL(req.query['image_url'].toString()).href
      }catch {
        return res.status(422).send("Invalid Image URL")
      }
      if (!imageUrl) {
        return res.status(400).send({message: 'Please input image url'})
      }

      if(!isValidUrl(imageUrl)) {
        return res.status(400).send({message: 'Please input correct image url'})
      }

      const result = await filterImageFromURL(imageUrl)

      res.sendFile(result)

    });

  app.delete('/clear', async (req: Request, res: Response) => {
     const tmpDir = __dirname + '/util/tmp'
     const filePaths = await getFilePathsFromDirectory(tmpDir)
     deleteLocalFiles(filePaths)
     console.log('Clear images success!')
     res.status(204).send({message: 'Clear images success!'})
  })

  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();