import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

/**
 * ApiContext can be used to pass a global Axios config.
 */
export const ApiContext = createContext({});

type UseApiResponse = [
    {
        /**
         * True if request is currently awaiting a response.
         */
        loading: boolean,

        /**
         * Data from the response body.
         */
        data: null | object | any[],

        /**
         * Any errors caught during the request cycle
         */
        error: any,

        /**
         * The HTTP status code
         */
        status: number,

        /**
         * True unless and until the request has been triggered at least once
         */
        initialLoad: boolean,

        /**
         * True if no request have been triggered, or if currently awaiting a
         * response
         */
        pendingOrLoading: boolean,

        /**
         * The full Axios response object
         */
        responseObj: object,
    },
    /**
     * Request Trigger function. Call with optiional body data for
     * POST/PATCH/PUT requests.
     *
     * Return a Promise that resolves with the data from response body, or any
     * errors thrown.
     */
    (requestData?: any[] | object) => Promise<any>,
];

type UseApiArgs = {
    /**
     * HTTP Method. Defaults to 'GET'
     */
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS',

    /**
     * Required: the request URL -- optionally use ApiContext to set a baseUrl
     */
    url: string,

    /**
     * Optional: default data to return before the request has been completed.
     * If this isn't set, the response data will contain null until a succesful
     * request has completed.
     */
    defaultData?: object | any[],

    /**
     * Optional: data to send in POST/PATCH/PUT
     */
    bodyData?: object | any[],

    /**
     * Optional: whether the request should be triggered immediately. Set to false
     * if you want to invoke the request yourself. Defaults to true
     */
    autoTrigger: boolean,
};

export const useApi = ({
    method = 'GET',
    autoTrigger = true,
    url,
    defaultData,
    bodyData,
}: UseApiArgs) => {
    const [initialLoad, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(defaultData || null)
    const [error, setError] = useState();
    const [status, setStatus] = useState();
    const [responseObj, setResponseObj] = useState();

    /**
     * The default Axios configuration can be overriden by
     * providing values in ApiContext
     */
    const globalConfig = useContext(ApiContext);

    /**
     * Requester function
     */
    const sendRequest = (requestData?: object | any[]) => {
        const requestConfig = {
            method,
            url,
            data: requestData,
        };

        /**
         * Merge request config with global axios config. If empty,
         * globalConfig defaults to {}
         */
        const axiosConfig = Object.assign({}, globalConfig, requestConfig);

        /**
         * Return a Promise to enable the calling code to chain
         * network requests in the correct order.
         */
        return new Promise(async (resolve, reject) => {
            setLoading(true);
            try {
                const response = await axios(axiosConfig);
                setResponseObj(response);
                setData(response.data);
                setStatus(response.status);
                resolve(data);
            } catch (err) {
                setError(error);
                reject(err);
            } finally {
                setLoading(false);
                if (initialLoad) setInitialLoad(false);
            }
        });
    };

    /**
     * If autoTrigger is set, we check initialLoad to ensure we only fire the
     * request once, and not on subsequent state changes
     */
    if (autoTrigger) {
        useEffect(() => {
            if (initialLoad) {
                /**
                 * Include body data if method allows
                 */
                if (['POST', 'PATCH', 'PUT'].includes(method)) {
                    sendRequest(bodyData);
                } else sendRequest();
            }
        }, []);
    }

    const response: UseApiResponse = [
        {
            loading,
            data,
            error,
            status,
            initialLoad,
            pendingOrLoading: initialLoad || loading,
            responseObj,
        },
        sendRequest,
    ];
    return response;
};

export default useApi;
