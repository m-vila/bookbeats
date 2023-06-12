let accessToken = null;
let refreshToken = null;
let tokenExpirationTime = null;

export const setAccessToken = (newAccessToken, newRefreshToken, expiresIn) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
    tokenExpirationTime = new Date().getTime() + expiresIn * 1000;
};

export const getAccessToken = () => {
    if (new Date().getTime() < tokenExpirationTime) {
        return accessToken;
    }
    return null;
};
