
import { Router } from "express";

const all_router = Router();

/* defind routes */
import v1_router from "./v1_routes";


all_router.route('/v1',v1_router)




export default all_router;


