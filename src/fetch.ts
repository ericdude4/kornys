type Synkro = {
    accessToken: String
}

declare global {
    interface Window { Synkro: Synkro; }
}

export function initFetch(accessToken: String) {
    window.Synkro = { accessToken: accessToken };
    return;
}

const baseUrl = "http://localhost:4000/api"
export async function get(path: String) {
    return fetch(baseUrl + path, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + window.Synkro.accessToken
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw response;
            }
        })
}

export async function post(path: String, body: object) {
    return fetch(baseUrl + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + window.Synkro.accessToken
        },
        body: JSON.stringify(body)
    })
        .then((response) => {
            if ((response.status >= 200 && response.status < 300) || (response.status >= 400 && response.status < 404)) {
                // These should all be client errors formatted as json
                return response.json()
            } else {
                throw response;
            }
        })
}