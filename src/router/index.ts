// this page is the main router page that will be used to import all the other routers and export them as a single router
// this will be used in the main index.ts file to import all the routers we do this to make the code more readable and maintainable
import express from 'express';
import authentication from './authentication';
import users from './users';
const router = express.Router();

export default (): express.Router => {
   authentication(router); 
   users(router); // we 
    return router;
}