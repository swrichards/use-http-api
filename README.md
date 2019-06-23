# use-http-api

> A React hook to easily manage HTTP requests via [Axios](https://github.com/axios/axios)

[![NPM](https://img.shields.io/npm/v/use-http-api.svg?style=plastic)](https://www.npmjs.com/package/use-http-api)

# Install

```bash
npm install --save use-http-api
```

```bash
yarn add --save use-http-api
```

# Quickstart

```tsx
import React, { useEffect, useRef } from 'react';
import useApi from 'use-http-api';

/**
 * Quickstart
 */
const UserList = () => {
    const [{ loading, data }, getUsers] = useApi({
        url: 'https://reqres.in/api/users',
        defaultData: { data: [] },
    });

    return (
        <div>
            {loading ? (
                'Loading...'
            ) : (
                <ol>
                    {data.data.map(user => (
                        <li>{user.email}</li>
                    ))}
                </ol>
            )}
            <button onClick={() => getUsers()}>Update</button>
        </div>
    );
};
```

# API

## useApi Hook

```javascript
import useApi from 'use-http-api';

const [response, triggerRequest] = useApi(config);
```

Where `config` is defined as:

```typescript
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
```

`useApi` returns a `[response, triggerRequest]` array with a response object and method to (re-)trigger the request:

```typescript
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
```

## ApiContext

You can use `ApiContext` to provde [default Axios configuration](https://github.com/axios/axios#request-config).

```javascript
import { ApiContext } from 'use-http-api';

const ExampleWithConfig = () => (
    <ApiContext.Provider
        value={{
            headers: {
                'X-Custom-Header': 'Foobar',
            },
        }}
    >
        <ComponentWithUseApi />
    </ApiContext.Provider>
);
```

# Examples

```javascript
import React, { useEffect, useRef } from 'react';
import useApi, { ApiContext } from 'use-http-api';

/**
 * Quickstart
 */
const UserList = () => {
    const [{ loading, data }, getUsers] = useApi({
        url: 'https://reqres.in/api/users',
        defaultData: { data: [] },
    });

    return (
        <div>
            {loading ? (
                'Loading...'
            ) : (
                <ol>
                    {data.data.map(user => (
                        <li>{user.email}</li>
                    ))}
                </ol>
            )}
            <button onClick={() => getUsers()}>Update</button>
        </div>
    );
};

/**
 * Set autoTrigger to false to manually trigger the request, e.g. in an event
 * handler.
 */
const LoginForm = () => {
    const [{ initialLoad, loading, data }, createUser] = useApi({
        method: 'POST',
        url: 'https://reqres.in/api/users',
        autoTrigger: false,
    });

    const nameRef = useRef();
    const jobRef = useRef();
    const handleOnClick = () =>
        createUser({ name: nameRef.current.value, job: jobRef.current.value });

    return (
        <div>
            <div>
                <input ref={nameRef} label="Name" />
                <input ref={jobRef} label="Job" />
            </div>
            <div>
                <button onClick={handleOnClick}>Create</button>
            </div>
            <div>
                Response:
                <pre>
                    {loading && 'Loading...\n'}
                    {initialLoad ? 'You must create a user first' : JSON.stringify(data)}
                </pre>
            </div>
        </div>
    );
};

/**
 * Use ApiContext to provide global Axios configurations defaults.
 * See https://github.com/axios/axios#request-config
 */
const UserListWithConfig = () => (
    <ApiContext.Provider
        value={{
            headers: {
                'X-Custom-Header': 'Foobar',
            },
        }}
    >
        <UserList />
    </ApiContext.Provider>
);

/**
 * Manually trigger network request that depends on some side effect.
 * Use pendingOrLoading to display a placeholder state until the request
 * completes.
 *
 * The pendingOrLoading return true if no requests have yet been triggered, or
 * if a network request is currently in progress.
 */
const UserListManualTrigger = () => {
    const [{ pendingOrLoading, data }, getUsers] = useApi({
        url: 'https://reqres.in/api/users',
        defaultData: { data: [] },
        autoTrigger: false,
    });

    useEffect(() => {
        setTimeout(getUsers, 6000);
    }, []);

    return (
        <div>
            {pendingOrLoading ? (
                'Request has either not yet been triggered or, is currently loading...'
            ) : (
                <ol>
                    {data.data.map(user => (
                        <li>{user.email}</li>
                    ))}
                </ol>
            )}
            <button onClick={() => getUsers()}>Update</button>
        </div>
    );
};

```

# License

MIT © [swrichards](https://github.com/swrichards)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
