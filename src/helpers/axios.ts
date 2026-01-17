import axios from "axios";

// const baseUrl = "http://api.weatherapi.com/v1/current.json?key=3a60761e33d94dc19e860030261701&aqi=no&q="

export const postRequest = async (url: string) => {
    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.data);
        return response
    } catch (err) {
        console.log(err)
        throw err;
    }
}