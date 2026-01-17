import { Router } from "express";
import { getAnalyticsByCities, getCityAnalytics } from "./analyticsController";

const analyticRouter = Router();

analyticRouter.post('/cities', getAnalyticsByCities)
analyticRouter.get('/:cityName', getCityAnalytics)


export default analyticRouter;