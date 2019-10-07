import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
    (requestData?: any[] | object) => Promise<any>
];

type UseApiArgs = {
    /**
     * HTTP Method. Defaults to 'GET'
     */
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS',

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
     * Whether the request should be triggered immediately. Set to false
     * if you want to invoke the request yourself. Defaults to false
     */
    asEffect?: boolean,
};

export const useApi = ({
    method = 'GET',
    asEffect = true,
    url,
    defaultData,
    bodyData,
}: UseApiArgs) => {
    const [initialLoad, setInitialLoad] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(defaultData || null);
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
     *
     * Wrapped in useCallback because we want to the requester method to have a
     * stable reference so we can use it as a dependency in useEffect.
     */
    const sendRequest = useCallback(
        (requestData?: object | any[]) => {
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
                    resolve(response.data);
                } catch (err) {
                    setError(err);
                    reject(err);
                } finally {
                    setLoading(false);
                    if (initialLoad) setInitialLoad(false);
                }
            });
        },
        [method, url, globalConfig]
    );

    /**
     * If autoTrigger is set, we check initialLoad to ensure we only fire the
     * request once, and not on subsequent state changes
     */
    if (asEffect) {
        useEffect(() => {
            /**
             * Include body data if method allows
             */
            if (['POST', 'PATCH', 'PUT'].includes(method)) {
                sendRequest(bodyData);
            } else sendRequest();
        }, [method, sendRequest, bodyData]);
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
