import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isValidUrl, getFilePathsFromDirectory} from './util/util';



(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  
  //    1. validate the image_url query
  app.get( "/", async ( request, response ) => {
    response.send("try GET /filteredimage?image_url={{}}")
  } );
  
  //    2. call filterImageFromURL(image_url) to filter the image
  app.get("/filteredimage", async (request: Request, response: Response) => {
    const imageUrl = request.query.image_url;

    if (!imageUrl) {
      return response.status(400).send({message: 'Input image url'})
    }

    if(!isValidUrl(imageUrl)) {
      return response.status(400).send({message: 'Input valid image url'})
    }

    const result = await filterImageFromURL(imageUrl)

    //    3. send the resulting file in the response
    response.sendFile(result)
    
  });

  //    4. deletes any files on the server on finish of the response
  app.delete('/clearImages', async (request: Request, response: Response) => {
    const tmpDir = __dirname + '/util/tmp'
    const filePaths = await getFilePathsFromDirectory(tmpDir)
    deleteLocalFiles(filePaths)
    response.status(204).send()
  })
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();