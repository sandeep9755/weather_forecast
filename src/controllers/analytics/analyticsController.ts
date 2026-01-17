import { NextFunction, Request, Response } from "express";
import { getAnalyticsUseCase } from "../../usecases/analytics/analyticsUseCase";

const useCase = getAnalyticsUseCase()

export const getAnalyticsByCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("reqBody", req.body)
        const cities = req.body?.cities || []
        if (cities.length === 0) {
            return res.status(400).json({ status: 400, success: false, error: "No cities provided" })
        }
        const analytics = await useCase.getAnalyticsByCities(cities)
        return res.json({ status: 200, success: true, data: analytics })
    } catch (err) {
        console.log("err", err)
        return res.status(500).json({ status: 500, success: false, error: "Internal server error" })
    }
}

export const getCityAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cityName = req.params?.cityName
        if (!cityName) {
            return res.status(400).json({ status: 400, success: false, error: "No city name provided" })
        }

        const analytics = await useCase.getCityAnalytics(cityName as string)
        return res.json({ status: 200, success: true, data: analytics })
    } catch (err) {
        console.log("err", err)
        return res.status(500).json({ status: 500, success: false, error: "Internal server error" })
    }
}