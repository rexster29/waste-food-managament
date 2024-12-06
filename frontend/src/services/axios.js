import axios from "axios";
import instance from "../../env";
import tokenService from "./token.service";
import api from "../utils/apiList";

const { headers, urlTimeout: timeout } = instance();
let _retry_count = 0;
let _retry = null;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function timeDelay(k) {
    const base_interval = 0.5
    const base_multiplier = 1.5
    const retry_interval = ((base_interval * (base_multiplier ** (k - 1))) * 1000)
    const max = k === 5 ? 500 : retry_interval
    return retry_interval + randomInt(0, max)
}

function wait(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay))
}

const axiosInstance = axios.create({
    headers,
    timeout
});
// request interceptor to check if auth-header contains token or not.
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = JSON.parse(localStorage.getItem('user'))?.accessToken || '';
        const refreshToken = JSON.parse(localStorage.getItem('user'))?.refreshToken || '';
        const sid = JSON.parse(localStorage.getItem('user'))?.sid || '';
        if (accessToken && refreshToken && sid) {
            config.headers['Authorization'] = `Bearer ${tokenService.getLocalAccessToken() || accessToken}`;
            config.headers['refreshToken'] = `Bearer ${tokenService.getLocalRefreshToken() || refreshToken}`;
            config.headers['sid'] = sid;
        }
        return config;
    }, (error) => Promise.reject(error)
);

// response interceptor to check if token is valid or expired
axiosInstance.interceptors.response.use((res) => res, async (err) => {
    const origReqConfig = err.config;
    // console.log("error", err);
    if (err.code != "ERR_NETWORK" && err.response?.status >= 500 && _retry_count < 1) {
        _retry_count++;
        return wait(timeDelay(_retry_count)).then(() => axiosInstance.request(origReqConfig))
    }
    // console.log("headers",origReqConfig.headers);

    if (err.response.status === 401 && origReqConfig.headers.hasOwnProperty('Authorization')) {
        const rtoken = tokenService.getLocalRefreshToken();
        console.log("rtoken", rtoken);

        if (rtoken && _retry_count < 4) {

            _retry_count++;

            delete origReqConfig.headers['Authorization']

            _retry = await refresh(rtoken)
                .finally(() => _retry = null)
                .catch(error => Promise.reject(error))
            console.log('_retry', _retry);
            return _retry.then((token) => {
                origReqConfig.headers['Authorization'] = `Bearer ${token}`
                return axiosInstance.request(origReqConfig)
            })
        }
    }
    return Promise.reject(err);
});
/** function to fetch refresh token on expiry */
export async function refresh(rtoken) {
    let _rtoken = ''
    let _token = ''
    console.log("refresh token");
    try {
        let response = await axios({
            baseURL: api.REFRESH_TOKEN.url,
            headers: headers,
            timeout,
            method: 'post',
        });

        // _rtoken = response.data?.rtoken;
        _token = response.data.accessToken;

        tokenService.updateLocalAccessToken(_token);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    } finally {
        return _token
    }
}

export default axiosInstance;