const currentURL = window.location.href;

function redirectToDiscord() {
    const baseURL = window.location.origin; // Extract base URL
    const AuthUrl = `${baseURL}/oauth/discord/?callbackUrl=${encodeURIComponent(currentURL)}`;
    window.location.href = AuthUrl;
}

document.addEventListener("DOMContentLoaded", function () {
    const storedAccessToken = getCookie("accessToken");
    displayContents();
    // Redirect to login if access token is not found
    if (!storedAccessToken) {
        // window.location.href = `https://auth.scyted.tv/staff.scyted.tv/discord?redirectUri=${currentURL}`;
        displayLoginButton();
    } else {
        // Fetch user data from Discord API
        fetchDiscordUserData(storedAccessToken)
            .then(userData => {
                // Display bot info and user info on the dashboard
                
                displayUserInfo(userData);

                const loggedInUserId = userData.id;

                // Fetch the list of user IDs from the JSON file
                // fetch('https://api.scyted.tv/wave-development/dashboard/access/scytedtv-user-access.json')
                fetch('https://api.scyted.tv/website/dashboard/access/dashboard-access.json')
                    .then(response => response.json())
                    .then(userIds => {
                        // Check if the logged-in user's ID is in the list
                        if (!userIds.includes(loggedInUserId)) {
                            // Clear cookies
                            // document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            // Redirect to the specified page if the user's ID is not in the 
                            // window.location.href = `https://auth.scyted.tv/staff.scyted.tv/discord?error=invalidAccess`;
                            displayContents();
                displayUserInfo(userData);
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching user IDs:", error);
                        // Handle error
                    });
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                // Clear cookies
                // document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                // Handle error (e.g., redirect to login page)
                // window.location.href = `https://auth.scyted.tv/staff.scyted.tv/discord?error=fetchingUserData`;
            });
    }
});

const urlParams = new URLSearchParams(window.location.hash.substring(1));
const accessToken = urlParams.get("access_token");

if (accessToken) {
    try {
        // Check if the access token is valid (add your validation logic here)
        if (isValidAccessToken(accessToken)) {
            // Store the access token in a cookie
            setCookie("accessToken", accessToken, 30); // Set cookie to expire in 30 days
            // Redirect to the dashboard
            window.location.href = "./";
        } else {
            // Clear the accessToken cookie
            clearCookie("accessToken");
        }
    } catch (error) {
        console.error("Error setting accessToken:", error);
    }
}

function isValidAccessToken(token) {
    // Add your validation logic here
    // Return true if the token is valid, otherwise return false
    return true; // Placeholder, replace with actual validation
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function clearCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function fetchDiscordUserData(accessToken) {
    const apiUrl = 'https://discord.com/api/users/@me';

    return fetch(apiUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Discord API Request Failed! Status: ${response.status}`);
            }
            return response.json();
        });
}

function logout() {
    // Clear cookies
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    window.location.href = `${currentURL}`;
}

// function backButton() {
//     window.location.href = `../`;
// }

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}
    
    function displayErrorInvalidAccess() {
        var fullpageDiv = document.getElementById("insert-content");
        fullpageDiv.innerHTML = `
        <div id="error-message" style="color: red;">
        This Discord account doesn't have access to this resource.
        </div>
        `;
    }
    
    function displayLoginButton() {
        var fullpageDiv = document.getElementById("login-container");
        fullpageDiv.innerHTML = `
        <button onclick="redirectToDiscord()" class="discord-button navbar-item">Login</button>
        `;
    }
    
    function displayContents() {
        return true;
    }
    
    function displayUserInfo(userData) {
    
        var fullpageDiv = document.getElementById("login-container");
        fullpageDiv.innerHTML = `
    <style>
    .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: right;
    }
    
    .profile-picture {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
        justify-content: right;
    }
    
    .user-dropdown {
        display: none;
        position: absolute;
        top: 60px;
        right: 20px;
        background-color: #fff;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        flex-direction: column;
        z-index: 1;
    }
    
    .user-dropdown a {
        color: #333;
        padding: 10px;
        text-decoration: none;
        display: block;
    }
    
    .user-dropdown a:hover {
        background-color: #ddd;
    }
    
    .user-dropdown.show {
        display: flex;
    }
    
    .user-dropdown a.logout {
        color: #ff5252;
    }
    </style>
    <div class="user-info" onclick="redirectToUserPage()">
    <img src="https://cdn.scyted.tv/website-assets/wave-development/default-discord.png"
        alt="Profile Picture" class="profile-picture">
    <span>Loading...</span>
    <div class="user-dropdown" id="userDropdown">
        <a href="#" class="logout" onclick="logout()">Logout</a>
    </div>
    </div>
        `;
    
        const userDropdown = document.getElementById('userDropdown');
                const profilePicture = document.querySelector('.profile-picture');
                const username = document.querySelector('.user-info span');
    
                // Check if userData.avatar is null
                if (userData.avatar === null || userData.avatar === "null") {
                    profilePicture.src = "https://cdn.scyted.tv/website-assets/wave-development/default-discord.png";
                } else {
                    profilePicture.src = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
                }
    
                username.textContent = userData.username;
        return true;
    }
    
    // function toggleUserDropdown() {
    //     const userDropdown = document.getElementById('userDropdown');
    //     userDropdown.classList.toggle('show');
    // }

    function redirectToUserPage() {
        const baseURL = window.location.origin; // Extract base URL
        const redirectUrl = `${baseURL}/dashboard/`;
        window.location.href = redirectUrl;
    }