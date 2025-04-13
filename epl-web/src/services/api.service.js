import axios from './axios.customize';

// Base URLs
const API_URL = import.meta.env.VITE_API_URL || "/api/v1";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8080/images";

// Authentication APIs
const loginAPI = (email, password) => {
    const data = {
        username: email,
        password: password
    }
    return axios.post(`${API_URL}/auth/login`, data);
}

const registerUserAPI = (fullName, email, password) => {
    const data = {
        name: fullName,
        email: email,
        password: password,
    }
    return axios.post(`${API_URL}/auth/register`, data);
}

const logoutAPI = () => {
    return axios.post(`${API_URL}/auth/logout`);
}

const getAccountAPI = () => {
    return axios.get(`${API_URL}/auth/account`);
}

// Player APIs
const fetchAllPlayersAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `${API_URL}/players?sortTransferHistory=true`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation for backward compatibility
        return axios.get(`${API_URL}/players?page=${currentOrParams}&size=${pageSize}&sortTransferHistory=true`);
    }
}

const fetchAllPlayersNoPaginationAPI = () => {
    return axios.get(`${API_URL}/players`);
}

const fetchPlayerDetailAPI = (id) => {
    return axios.get(`${API_URL}/players/${id}?sortTransferHistory=true`);
}

const createPlayerAPI = (playerData) => {
    return axios.post(`${API_URL}/players`, playerData);
}

const updatePlayerAPI = (playerData) => {
    return axios.put(`${API_URL}/players/${playerData.id}`, playerData);
}

const deletePlayerAPI = (id) => {
    return axios.delete(`${API_URL}/players/${id}`);
}

// New function for player image upload
const createPlayerWithImageAPI = (playerData, imageFile) => {
    const formData = new FormData();
    
    // Add player data as JSON string
    formData.append('data', new Blob([JSON.stringify(playerData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/players`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// New function for player image update
const updatePlayerWithImageAPI = (playerData, imageFile) => {
    const formData = new FormData();
    
    // Add player data as JSON string
    formData.append('data', new Blob([JSON.stringify(playerData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/players`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// Coach APIs
const fetchAllCoachesAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `${API_URL}/coaches?sortTransferHistory=true`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation
        return axios.get(`${API_URL}/coaches?page=${currentOrParams}&size=${pageSize}&sortTransferHistory=true`);
    }
}

const fetchCoachDetailAPI = (id) => {
    return axios.get(`${API_URL}/coaches/${id}?sortCoachClubs=true`);
}

const createCoachAPI = (data) => {
    return axios.post(`${API_URL}/coaches`, data);
}

const updateCoachAPI = (data) => {
    return axios.put(`${API_URL}/coaches/${data.id}`, data);
}

const deleteCoachAPI = (id) => {
    return axios.delete(`${API_URL}/coaches/${id}`);
}

// New function for coach image upload
const createCoachWithImageAPI = (coachData, imageFile) => {
    const formData = new FormData();
    
    // Add coach data as JSON string
    formData.append('data', new Blob([JSON.stringify(coachData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/coaches`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// New function for coach image update
const updateCoachWithImageAPI = (coachData, imageFile) => {
    const formData = new FormData();
    
    // Add coach data as JSON string
    formData.append('data', new Blob([JSON.stringify(coachData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/coaches/${coachData.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// Coach Club API endpoints
const createCoachClubAPI = (data) => {
    return axios.post(`${API_URL}/coach-clubs`, data);
}

const updateCoachClubAPI = (data) => {
    return axios.put(`${API_URL}/coach-clubs`, data);
}

const deleteCoachClubAPI = (id) => {
    return axios.delete(`${API_URL}/coach-clubs/${id}`);
}

// Club APIs
const fetchAllClubsAPI = () => {
    return axios.get(`${API_URL}/clubs`);
}

const fetchAllClubsWithPaginationAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `${API_URL}/clubs?`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation
        return axios.get(`${API_URL}/clubs?page=${currentOrParams}&size=${pageSize}`);
    }
}

const fetchClubDetailAPI = (id) => {
    return axios.get(`${API_URL}/clubs/${id}`);
}

const createClubAPI = (data) => {
    return axios.post(`${API_URL}/clubs`, data);
}

const editClubAPI = (data) => {
    return axios.put(`${API_URL}/clubs`, data);
}

const deleteClubAPI = (id) => {
    return axios.delete(`${API_URL}/clubs/${id}`);
}

// New function for club image upload
const createClubWithImageAPI = (clubData, imageFile) => {
    const formData = new FormData();
    
    // Add club data as JSON string
    formData.append('data', new Blob([JSON.stringify(clubData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/clubs`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// New function for club image update
const updateClubWithImageAPI = (clubData, imageFile) => {
    const formData = new FormData();
    
    // Add club data as JSON string
    formData.append('data', new Blob([JSON.stringify(clubData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/clubs/${clubData.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const getClubSquadAPI = (clubId, seasonId) => {
    return axios.get(`${API_URL}/clubs/${clubId}/squad?seasonId=${seasonId}`);
}

const getClubTransfersAPI = (clubId, seasonId) => {
    return axios.get(`${API_URL}/clubs/${clubId}/transfers?seasonId=${seasonId}`);
}

const getClubSeasonsAPI = (clubId) => {
    return axios.get(`${API_URL}/clubs/${clubId}/seasons`);
}

// League APIs
const fetchAllLeaguesAPI = (currentOrParams, pageSize) => {
    // Check if first parameter is an object (params) or a number (current page)
    if (typeof currentOrParams === 'object') {
        const params = currentOrParams;
        let url = `${API_URL}/leagues?`;

        // Add pagination parameters
        if (params.page) url += `&page=${params.page}`;
        if (params.size) url += `&size=${params.size}`;

        // Add filter if present
        if (params.filter) url += `&filter=${encodeURIComponent(params.filter)}`;

        // Add sort if present
        if (params.sort) url += `&sort=${encodeURIComponent(params.sort)}`;

        return axios.get(url);
    } else {
        // Original implementation
        return axios.get(`${API_URL}/leagues?page=${currentOrParams}&size=${pageSize}`);
    }
}

const fetchLeagueDetailAPI = (id) => {
    return axios.get(`${API_URL}/leagues/${id}`);
}

const createLeagueAPI = (leagueData) => {
    return axios.post(`${API_URL}/leagues`, leagueData);
}

const updateLeagueAPI = (leagueData) => {
    return axios.put(`${API_URL}/leagues`, leagueData);
}

const deleteLeagueAPI = (id) => {
    return axios.delete(`${API_URL}/leagues/${id}`);
}

// New function for league image upload
const createLeagueWithImageAPI = (leagueData, imageFile) => {
    const formData = new FormData();
    
    // Add league data as JSON string
    formData.append('data', new Blob([JSON.stringify(leagueData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/leagues`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// New function for league image update
const updateLeagueWithImageAPI = (leagueData, imageFile) => {
    const formData = new FormData();
    
    // Add league data as JSON string
    formData.append('data', new Blob([JSON.stringify(leagueData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/leagues/${leagueData.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

// League Season APIs
const createLeagueSeasonAPI = (data) => {
    return axios.post(`${API_URL}/league-seasons`, data);
}

const updateLeagueSeasonAPI = (data) => {
    return axios.put(`${API_URL}/league-seasons`, data);
}

const deleteLeagueSeasonAPI = (id) => {
    return axios.delete(`${API_URL}/league-seasons/${id}`);
}

const fetchLeagueSeasonDetailAPI = (id) => {
    return axios.get(`${API_URL}/league-seasons/${id}`);
}

// Club Season Table APIs
const createClubSeasonTableAPI = (data) => {
    return axios.post(`${API_URL}/club-season-tables`, data);
}

const updateClubSeasonTableAPI = (data) => {
    return axios.put(`${API_URL}/club-season-tables`, data);
}

const deleteClubSeasonTableAPI = (id) => {
    return axios.delete(`${API_URL}/club-season-tables/${id}`);
}

// Transfer APIs
const createTransferHistoryAPI = (data) => {
    return axios.post(`${API_URL}/transfers`, data);
}

const updateTransferAPI = (data) => {
    return axios.put(`${API_URL}/transfers`, data);
}

const deleteTransferAPI = (id) => {
    return axios.delete(`${API_URL}/transfers/${id}`);
}

// Match APIs
const fetchMatchesBySeasonAPI = (seasonId) => {
    return axios.get(`${API_URL}/matches?filter=season:${seasonId}&sort=round,asc`);
}

const fetchMatchDetailAPI = (id) => {
    return axios.get(`${API_URL}/matches/${id}`);
}

const createMatchAPI = (data) => {
    return axios.post(`${API_URL}/matches`, data);
}

const updateMatchAPI = (data) => {
    return axios.put(`${API_URL}/matches`, data);
}

const deleteMatchAPI = (id) => {
    return axios.delete(`${API_URL}/matches/${id}`);
}

// Match Action APIs
const fetchMatchActionsAPI = (matchId) => {
    return axios.get(`${API_URL}/match-actions?filter=match:${matchId}`);
}

const createMatchActionAPI = (data) => {
    return axios.post(`${API_URL}/match-actions`, data);
}

const updateMatchActionAPI = (data) => {
    return axios.put(`${API_URL}/match-actions`, data);
}

const deleteMatchActionAPI = (id) => {
    return axios.delete(`${API_URL}/match-actions/${id}`);
}

// Statistics APIs
const getTopGoalScorerAPI = (seasonId) => {
    return axios.get(`${API_URL}/league-seasons/${seasonId}/top-goal-scorers`);
}

const getTopAssistsAPI = (seasonId) => {
    return axios.get(`${API_URL}/league-seasons/${seasonId}/top-assists`);
}

const getTopYellowCardsAPI = (seasonId) => {
    return axios.get(`${API_URL}/league-seasons/${seasonId}/top-yellow-cards`);
}

const getTopRedCardsAPI = (seasonId) => {
    return axios.get(`${API_URL}/league-seasons/${seasonId}/top-red-cards`);
}

// Club Statistics APIs
const getClubTopScorersAPI = (seasonId, clubId) => {
    return axios.get(`${API_URL}/league-seasons/${seasonId}/clubs/${clubId}/top-goal-scorers`);
}

const getClubTopAssistsAPI = (seasonId, clubId) => {
    return axios.get(`${API_URL}/league-seasons/${seasonId}/clubs/${clubId}/top-assists`);
}

// New search APIs for players, coaches, clubs and leagues
const getSearchPlayersAPI = (filters) => {
    return axios.post(`${API_URL}/players/search`, filters);
}

const getSearchCoachesAPI = (filters) => {
    return axios.post(`${API_URL}/coaches/search`, filters);
}

const getSearchClubsAPI = (filters) => {
    return axios.post(`${API_URL}/clubs/search`, filters);
}

const getSearchLeaguesAPI = (filters) => {
    return axios.post(`${API_URL}/leagues/search`, filters);
}

// Helper function to get the full URL for an image
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If the imagePath is already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Otherwise, prepend the image base URL
    return `${IMAGE_BASE_URL}/${imagePath}`;
}

export {
    // Authentication APIs
    loginAPI,
    registerUserAPI,
    logoutAPI,
    getAccountAPI,
    
    // Player APIs
    fetchAllPlayersAPI,
    fetchAllPlayersNoPaginationAPI,
    fetchPlayerDetailAPI,
    createPlayerAPI,
    updatePlayerAPI,
    deletePlayerAPI,
    createPlayerWithImageAPI,
    updatePlayerWithImageAPI,
    getSearchPlayersAPI,
    
    // Coach APIs
    fetchAllCoachesAPI,
    fetchCoachDetailAPI,
    createCoachAPI,
    updateCoachAPI,
    deleteCoachAPI,
    createCoachWithImageAPI,
    updateCoachWithImageAPI,
    getSearchCoachesAPI,
    
    // Coach Club APIs
    createCoachClubAPI,
    updateCoachClubAPI,
    deleteCoachClubAPI,
    
    // Club APIs
    fetchAllClubsAPI,
    fetchAllClubsWithPaginationAPI,
    fetchClubDetailAPI,
    createClubAPI,
    editClubAPI,
    deleteClubAPI,
    createClubWithImageAPI,
    updateClubWithImageAPI,
    getClubSquadAPI,
    getClubTransfersAPI,
    getClubSeasonsAPI,
    getSearchClubsAPI,
    
    // League APIs
    fetchAllLeaguesAPI,
    fetchLeagueDetailAPI,
    createLeagueAPI,
    updateLeagueAPI,
    deleteLeagueAPI,
    createLeagueWithImageAPI,
    updateLeagueWithImageAPI,
    getSearchLeaguesAPI,
    
    // League Season APIs
    createLeagueSeasonAPI,
    updateLeagueSeasonAPI,
    deleteLeagueSeasonAPI,
    fetchLeagueSeasonDetailAPI,
    
    // Club Season Table APIs
    createClubSeasonTableAPI,
    updateClubSeasonTableAPI,
    deleteClubSeasonTableAPI,
    
    // Transfer APIs
    createTransferHistoryAPI,
    updateTransferAPI,
    deleteTransferAPI,
    
    // Match APIs
    fetchMatchesBySeasonAPI,
    fetchMatchDetailAPI,
    createMatchAPI,
    updateMatchAPI,
    deleteMatchAPI,
    
    // Match Action APIs
    fetchMatchActionsAPI,
    createMatchActionAPI,
    updateMatchActionAPI,
    deleteMatchActionAPI,
    
    // Statistics APIs
    getTopGoalScorerAPI,
    getTopAssistsAPI,
    getTopYellowCardsAPI,
    getTopRedCardsAPI,
    getClubTopScorersAPI,
    getClubTopAssistsAPI,
    
    // Image Helper
    getImageUrl
}

