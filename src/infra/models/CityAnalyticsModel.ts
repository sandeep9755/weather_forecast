import { IAnalytics } from "../../domain/IAnalytics";
import { ICityAnalytics } from "../../domain/ICityAnalytics";
import BaseModel from "./IBaseModel";

interface CityAnalyticsModel extends ICityAnalytics {}

class CityAnalyticsModel extends BaseModel {
    static get tableName() {
        return 'city_analytics';
    }
}

export default CityAnalyticsModel;