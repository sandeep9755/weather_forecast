import { IAnalytics } from "../../domain/IAnalytics";
import BaseModel from "./IBaseModel";

interface AnalyticsModel extends IAnalytics {}

class AnalyticsModel extends BaseModel {
    static get tableName() {
        return 'analtyics';
    }
}

export default AnalyticsModel;