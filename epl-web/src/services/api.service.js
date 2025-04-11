import axios from './axios.customize';

// Base URLs
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || "http://localhost:8080/images";

// Player APIs
export const getPlayersAPI = () => {
    return axios.get(`${API_URL}/players`);
};

export const getPlayerAPI = (id) => {
    return axios.get(`${API_URL}/players/${id}`);
};

export const createPlayerAPI = (player) => {
    return axios.post(`${API_URL}/players`, player);
};

// Function to handle player creation with image upload
export const createPlayerWithImageAPI = (playerData, imageFile) => {
    const formData = new FormData();
    
    // Add player data as JSON string
    formData.append('player', new Blob([JSON.stringify(playerData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/players/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updatePlayerAPI = (id, player) => {
    return axios.put(`${API_URL}/players/${id}`, player);
};

// Function to handle player update with image upload
export const updatePlayerWithImageAPI = (id, playerData, imageFile) => {
    const formData = new FormData();
    
    // Add player data as JSON string
    formData.append('player', new Blob([JSON.stringify(playerData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/players/${id}/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deletePlayerAPI = (id) => {
    return axios.delete(`${API_URL}/players/${id}`);
};

export const fetchPlayerDetailAPI = (id) => {
    return axios.get(`${API_URL}/players/${id}`);
};

export const getSearchPlayersAPI = (filters) => {
    return axios.post(`${API_URL}/players/search`, filters);
};

// Coach APIs
export const getCoachesAPI = () => {
    return axios.get(`${API_URL}/coaches`);
};

export const getCoachAPI = (id) => {
    return axios.get(`${API_URL}/coaches/${id}`);
};

export const createCoachAPI = (coach) => {
    return axios.post(`${API_URL}/coaches`, coach);
};

// Function to handle coach creation with image upload
export const createCoachWithImageAPI = (coachData, imageFile) => {
    const formData = new FormData();
    
    // Add coach data as JSON string
    formData.append('coach', new Blob([JSON.stringify(coachData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/coaches/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateCoachAPI = (id, coach) => {
    return axios.put(`${API_URL}/coaches/${id}`, coach);
};

// Function to handle coach update with image upload
export const updateCoachWithImageAPI = (id, coachData, imageFile) => {
    const formData = new FormData();
    
    // Add coach data as JSON string
    formData.append('coach', new Blob([JSON.stringify(coachData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/coaches/${id}/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteCoachAPI = (id) => {
    return axios.delete(`${API_URL}/coaches/${id}`);
};

export const fetchCoachDetailAPI = (id) => {
    return axios.get(`${API_URL}/coaches/${id}`);
};

export const getSearchCoachesAPI = (filters) => {
    return axios.post(`${API_URL}/coaches/search`, filters);
};

// Club APIs
export const getClubsAPI = () => {
    return axios.get(`${API_URL}/clubs`);
};

export const getClubAPI = (id) => {
    return axios.get(`${API_URL}/clubs/${id}`);
};

export const createClubAPI = (club) => {
    return axios.post(`${API_URL}/clubs`, club);
};

// Function to handle club creation with image upload
export const createClubWithImageAPI = (clubData, imageFile) => {
    const formData = new FormData();
    
    // Add club data as JSON string
    formData.append('club', new Blob([JSON.stringify(clubData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/clubs/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateClubAPI = (id, club) => {
    return axios.put(`${API_URL}/clubs/${id}`, club);
};

// Function to handle club update with image upload
export const updateClubWithImageAPI = (id, clubData, imageFile) => {
    const formData = new FormData();
    
    // Add club data as JSON string
    formData.append('club', new Blob([JSON.stringify(clubData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/clubs/${id}/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteClubAPI = (id) => {
    return axios.delete(`${API_URL}/clubs/${id}`);
};

export const fetchClubDetailAPI = (id) => {
    return axios.get(`${API_URL}/clubs/${id}`);
};

export const getSearchClubsAPI = (filters) => {
    return axios.post(`${API_URL}/clubs/search`, filters);
};

export const getClubSeasonsAPI = (clubId) => {
    return axios.get(`${API_URL}/clubs/${clubId}/seasons`);
};

export const getClubSquadAPI = (clubId, seasonId) => {
    return axios.get(`${API_URL}/clubs/${clubId}/squad?seasonId=${seasonId}`);
};

export const getClubTransfersAPI = (clubId, seasonId) => {
    return axios.get(`${API_URL}/clubs/${clubId}/transfers?seasonId=${seasonId}`);
};

// League APIs
export const getLeaguesAPI = () => {
    return axios.get(`${API_URL}/leagues`);
};

export const getLeagueAPI = (id) => {
    return axios.get(`${API_URL}/leagues/${id}`);
};

export const createLeagueAPI = (league) => {
    return axios.post(`${API_URL}/leagues`, league);
};

// Function to handle league creation with image upload
export const createLeagueWithImageAPI = (leagueData, imageFile) => {
    const formData = new FormData();
    
    // Add league data as JSON string
    formData.append('league', new Blob([JSON.stringify(leagueData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.post(`${API_URL}/leagues/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateLeagueAPI = (id, league) => {
    return axios.put(`${API_URL}/leagues/${id}`, league);
};

// Function to handle league update with image upload
export const updateLeagueWithImageAPI = (id, leagueData, imageFile) => {
    const formData = new FormData();
    
    // Add league data as JSON string
    formData.append('league', new Blob([JSON.stringify(leagueData)], { type: 'application/json' }));
    
    // Add image file if provided
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    return axios.put(`${API_URL}/leagues/${id}/with-image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteLeagueAPI = (id) => {
    return axios.delete(`${API_URL}/leagues/${id}`);
};

export const fetchLeagueDetailAPI = (id) => {
    return axios.get(`${API_URL}/leagues/${id}`);
};

// League Season APIs
export const createLeagueSeasonAPI = (leagueSeason) => {
    return axios.post(`${API_URL}/league-seasons`, leagueSeason);
};

export const updateLeagueSeasonAPI = (id, leagueSeason) => {
    return axios.put(`${API_URL}/league-seasons/${id}`, leagueSeason);
};

export const deleteLeagueSeasonAPI = (id) => {
    return axios.delete(`${API_URL}/league-seasons/${id}`);
};

export const fetchLeagueSeasonDetailAPI = (id) => {
    return axios.get(`${API_URL}/league-seasons/${id}`);
};

// Coach Club APIs
export const createCoachClubAPI = (coachClub) => {
    return axios.post(`${API_URL}/coach-clubs`, coachClub);
};

export const updateCoachClubAPI = (id, coachClub) => {
    return axios.put(`${API_URL}/coach-clubs/${id}`, coachClub);
};

export const deleteCoachClubAPI = (id) => {
    return axios.delete(`${API_URL}/coach-clubs/${id}`);
};

// Transfer History APIs
export const createTransferHistoryAPI = (transfer) => {
    return axios.post(`${API_URL}/transfers`, transfer);
};

export const updateTransferHistoryAPI = (id, transfer) => {
    return axios.put(`${API_URL}/transfers/${id}`, transfer);
};

export const deleteTransferHistoryAPI = (id) => {
    return axios.delete(`${API_URL}/transfers/${id}`);
};

// League Season Club APIs
export const getLeagueSeasonClubsAPI = (leagueSeasonId) => {
    return axios.get(`${API_URL}/league-seasons/${leagueSeasonId}/clubs`);
};

export const addClubToLeagueSeasonAPI = (leagueSeasonId, clubId) => {
    return axios.post(`${API_URL}/league-seasons/${leagueSeasonId}/clubs/${clubId}`);
};

export const removeClubFromLeagueSeasonAPI = (leagueSeasonId, clubId) => {
    return axios.delete(`${API_URL}/league-seasons/${leagueSeasonId}/clubs/${clubId}`);
};

// Match APIs
export const createMatchAPI = (match) => {
    return axios.post(`${API_URL}/matches`, match);
};

export const getMatchesForLeagueSeasonAPI = (leagueSeasonId) => {
    return axios.get(`${API_URL}/league-seasons/${leagueSeasonId}/matches`);
};

export const getMatchDetailAPI = (matchId) => {
    return axios.get(`${API_URL}/matches/${matchId}`);
};

export const updateMatchAPI = (matchId, match) => {
    return axios.put(`${API_URL}/matches/${matchId}`, match);
};

export const deleteMatchAPI = (matchId) => {
    return axios.delete(`${API_URL}/matches/${matchId}`);
};

// Match Action APIs
export const addMatchActionAPI = (matchId, action) => {
    return axios.post(`${API_URL}/matches/${matchId}/actions`, action);
};

export const updateMatchActionAPI = (actionId, action) => {
    return axios.put(`${API_URL}/match-actions/${actionId}`, action);
};

export const deleteMatchActionAPI = (actionId) => {
    return axios.delete(`${API_URL}/match-actions/${actionId}`);
};

// League Statistics APIs
export const getTopGoalScorerAPI = (leagueSeasonId) => {
    return axios.get(`${API_URL}/league-seasons/${leagueSeasonId}/statistics/top-scorers`);
};

export const getTopAssistsAPI = (leagueSeasonId) => {
    return axios.get(`${API_URL}/league-seasons/${leagueSeasonId}/statistics/top-assists`);
};

export const getTopYellowCardsAPI = (leagueSeasonId) => {
    return axios.get(`${API_URL}/league-seasons/${leagueSeasonId}/statistics/top-yellow-cards`);
};

export const getTopRedCardsAPI = (leagueSeasonId) => {
    return axios.get(`${API_URL}/league-seasons/${leagueSeasonId}/statistics/top-red-cards`);
};

// Authentication APIs
export const loginAPI = (credentials) => {
    return axios.post(`${API_URL}/auth/login`, credentials);
};

export const registerAPI = (user) => {
    return axios.post(`${API_URL}/auth/register`, user);
};

// Helper function to get the full URL for an image
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If the imagePath is already a full URL, return it as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Otherwise, prepend the image base URL
    return `${IMAGE_BASE_URL}/${imagePath}`;
};

