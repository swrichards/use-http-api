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

const App = () => (
    <React.Fragment>
        <UserList />
        <hr />
        <LoginForm />
        <hr />
        <UserListWithConfig />
        <hr />
        <UserListManualTrigger />
    </React.Fragment>
);

export default App;
