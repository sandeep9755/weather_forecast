import axios from "axios"
import { IAnalytics } from "../../domain/IAnalytics"
import { postRequest } from "../../helpers/axios"
import { getAnalyticsRepo } from "../../infra/repo/AnalyicsRepo"
import { ICityAnalytics } from "../../domain/ICityAnalytics"


const analyticsRepo = getAnalyticsRepo()

const getAnalyticsByCities = () => async (cities: any[]) => {
    const analyticsArray: IAnalytics[] = []
    for (const city of cities) {
        const url = `https://api.weatherapi.com/v1/current.json?key=3a60761e33d94dc19e860030261701&q=${city}&aqi=no`
        const data = await postRequest(url)
        const analytics: IAnalytics = {
            cityName: city,
            temp: data.current.temp_c,
            metaData: "",
        } as IAnalytics
        const created = await analyticsRepo.updateData(analytics)
        analyticsArray.push(created)
    }
    const temps = await analyticsRepo.getAll(cities)
    return buildAnalytics(temps)
}

const buildAnalytics = (rows: any[]) => {
    if (rows.length === 0) return { message: "No data found" }

    const temps = rows.map(r => r.temp)
    const avgTemp = temps.reduce((a, b) => Number(a) + Number(b), 0) / temps.length
    const highest = rows.reduce((prev, current) => (Number(prev.temp) > Number(current.temp)) ? prev : current)
    const lowest = rows.reduce((prev, current) => (Number(prev.temp) < Number(current.temp)) ? prev : current)

    const hotCities = rows.filter(r => r.temp > avgTemp).map(r => r.cityName)

    return {
        averageTemperature: Number(avgTemp.toFixed(2)),
        highestTemperature: {
            city: highest.cityName,
            temp: highest.temp
        },
        lowestTemperature: {
            city: lowest.cityName,
            temp: lowest.temp
        },
        hotCities: hotCities
    }
}

const updateCityAnalytics = async (cityName: string) => {
    let lastRecorded = await analyticsRepo.getCurrentTemp(cityName)
    if (lastRecorded) {
        console.log("lasRecorded")
        const lastDate = new Date(lastRecorded.createdAt).toLocaleDateString()
        const now = new Date().toLocaleDateString()

        console.log("Last date", lastDate, "now", now)
        if (now === lastDate) return
    }
    let url = `http://api.weatherapi.com/v1/forecast.json?key=3a60761e33d94dc19e860030261701&q=${cityName}&days=5&aqi=no&alerts=no`
    const data = await postRequest(url)

    const currentTemp = data.current.temp_c

    let dataArray: any[] = []
    dataArray.push({
        city: cityName,
        createdAt: new Date(),
        day: new Date(data.location.localtime),
        temp: currentTemp,
        type: "current"
    } as ICityAnalytics)
    for (let singleDay of data.forecast.forecastday) {
        const date = singleDay.date
        const maxTemp = singleDay.day.maxtemp_c
        const minTemp = singleDay.day.mintemp_c

        let obj: ICityAnalytics = {
            city: cityName,
            day: date,
            temp: singleDay.day.avgtemp_c,
            minTemp: minTemp,
            maxTemp: maxTemp,
            createdAt: new Date(),
            type: "forecast"
        } as ICityAnalytics
        dataArray.push(obj)
    }
    await analyticsRepo.bulkEntry(dataArray)
}

const getWarning = (temp: number | string) => {
    if (Number(temp) > 35) return "High Temperature"
    return "Normal Temperature"
}

const getCityAnalytics = () => async (cityName: string) => {
    await updateCityAnalytics(cityName)
    const current = await analyticsRepo.getCurrentTemp(cityName)
    const forecast = await analyticsRepo.getForeCast(cityName)
    const warning = getWarning(current.temp)
    return {
        current, forecast, warning
    }
}

export const getAnalyticsUseCase = () => {
    return {
        getAnalyticsByCities: getAnalyticsByCities(),
        getCityAnalytics: getCityAnalytics(),
    }
}