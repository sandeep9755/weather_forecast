import { IAnalytics } from "../../domain/IAnalytics"
import { ICityAnalytics } from "../../domain/ICityAnalytics"
import knexInstance from "../init"
import AnalyticsModel from "../models/AnalyticsModel"
import CityAnalyticsModel from "../models/CityAnalyticsModel"

const updateData = () => async (data: IAnalytics): Promise<any> => {
    const existing = await AnalyticsModel.query(knexInstance).findOne({ cityName: data.cityName })
    if (existing) {
        return await AnalyticsModel.query(knexInstance).findById(existing.id).patch(data)
    }
    return await AnalyticsModel.query(knexInstance).insert(data)
}

const getAll = () => async (cities: string[]) => {
    return await AnalyticsModel.query(knexInstance).whereIn('cityName', cities)
}

const updateCityAnalytics = () => async () => {
    return await CityAnalyticsModel.query(knexInstance).insert()
}

const bulkEntry = () => async (arr: any) => {
    return await CityAnalyticsModel.query(knexInstance).insert(arr)
}

const getCurrentTemp = () => async (city: string) => {
    return await CityAnalyticsModel.query(knexInstance).findOne({ city, type: 'current' })
        .orderBy('created_at', 'ASC').limit(1)
}

const getForeCast = () => async (city: string) => {
    return await CityAnalyticsModel.query(knexInstance).where('city', city)
        .andWhere('type', 'forecast').orderBy('created_at', 'ASC').limit(5)
}

export const getAnalyticsRepo = () => {
    return {
        updateData: updateData(),
        getAll: getAll(),
        updateCityAnalytics: updateCityAnalytics(),
        bulkEntry: bulkEntry(),
        getForeCast: getForeCast(),
        getCurrentTemp: getCurrentTemp()
    }
}