import { Router } from "express";
import analyticRouter from "./analytics";

const router = Router()

router.use('/analytics', analyticRouter)

export default router;