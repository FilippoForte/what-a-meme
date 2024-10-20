const SERVER_URL = 'http://localhost:3001/api';

// Function to handle invalid responses from API calls
function handleInvalidResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText); // Throw error if response status is not OK
    }
    let type = response.headers.get('Content-Type');
    if (type !== null && type.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${type}`); // Throw error if response is not JSON
    }
    return response; // Return valid response
}

/*** USER APIs ***/

// Function to log in user with provided credentials
const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include', // Include authentication cookie
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to log out current user session
async function logOut() {
    return await fetch(SERVER_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    }).then(handleInvalidResponse);
}

// Function to fetch current user's information
async function getUserInfo() {
    return await fetch(SERVER_URL + '/sessions/current', {
        method: 'GET',
        credentials: 'include'
    }).then(handleInvalidResponse)
        .then(response => response.json());
};

// Function to fetch current user's game history
async function getUserGames() {
    return await fetch(SERVER_URL + `/sessions/current/games`, {
        method: 'POST',
        credentials: 'include'
    }).then(handleInvalidResponse)
        .then(response => response.json());
}

/*** MEME APIs ***/

// Function to fetch memes with specified count
async function getMemes(count) {
    return await fetch(SERVER_URL + "/memes", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count })
    }).then(handleInvalidResponse)
        .then(response => response.json());
}

// Function to check if user's answer is correct
async function checkAnswer(memeId, captionId) {
    return await fetch(SERVER_URL + "/meme/checkAnswer", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memeId, captionId })
    }).then(handleInvalidResponse)
        .then(response => response.json());
}

// Function to fetch answers for a meme
async function getAnswers(memeId) {
    return await fetch(SERVER_URL + "/meme/getAnswers", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memeId })
    })
        .then(handleInvalidResponse)
        .then(response => response.json());
}

/*** GAME APIs ***/

// Function to save all rounds data at the end of a game
async function saveRounds(roundsData, userId) {
    const response = await fetch(SERVER_URL + '/saveRounds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roundsData, userId }),
    })
        .then(handleInvalidResponse); // Handle response validation
}

// Exported API object containing all defined functions
const API = { getMemes, logIn, logOut, getUserInfo, checkAnswer, getAnswers, getUserGames, saveRounds }
export default API;
