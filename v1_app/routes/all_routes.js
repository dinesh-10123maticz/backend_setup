
import { Router } from "express";

const all_router = Router();

/* defind routes */
import userRoutes from '../user/routes/routes.js'


all_router.route('/user',userRoutes)




export default all_router;


