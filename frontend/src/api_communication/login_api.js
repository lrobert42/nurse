/*
 *  Utils functions for Login 
 *
 */


export async function fetch_login(credentials, handleLogin, set_error)
{
    const response = await fetch('/auth/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(credentials),
                            })

    let res = await response.json();
    let status = response.status;
    if (status === 200)
    {
        handleLogin(res, credentials);
    }
    else
    {
        set_error(true)
        res.text().then( (text) => 
               console.error(`Request rejected with status ${res.status} and message ${text}`))

    }
}

