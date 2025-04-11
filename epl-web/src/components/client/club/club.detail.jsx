// epl-web/src/components/client/club/club.detail.jsx
import { useEffect, useState } from "react";
import { Descriptions, Spin, Tabs, Row, Col, Card } from "antd";
import { useParams } from "react-router-dom";
import { fetchClubDetailAPI, getImageUrl, getClubSquadAPI, getClubTransfersAPI, getClubSeasonsAPI } from "../../../services/api.service.js";
import ClubSquad from "./club.squad.jsx";
import ClubTransferHistory from "./club.transfer.history.jsx";

const ClientClubDetail = () => {
    const { id } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [seasons, setSeasons] = useState([]);
    const [squad, setSquad] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [activeTab, setActiveTab] = useState("1");
    const [loadingSquad, setLoadingSquad] = useState(false);
    const [loadingTransfers, setLoadingTransfers] = useState(false);

    // Load club details when component mounts
    useEffect(() => {
        loadClubDetail();
        loadClubSeasons();
    }, [id]);

    // Load squad and transfers when selected season changes
    useEffect(() => {
        if (selectedSeason) {
            loadClubSquad(selectedSeason);
            loadClubTransfers(selectedSeason);
        }
    }, [selectedSeason]);

    // Function to fetch club details from API
    const loadClubDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchClubDetailAPI(id);
            if (response.data) {
                setClub(response.data);
            }
        } catch (error) {
            console.error("Error loading club detail:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to load available seasons for the club
    const loadClubSeasons = async () => {
        try {
            const response = await getClubSeasonsAPI(id);
            if (response.data && Array.isArray(response.data)) {
                setSeasons(response.data);
                // Set the most recent season as the default selected season
                if (response.data.length > 0) {
                    setSelectedSeason(response.data[0].id);
                }
            }
        } catch (error) {
            console.error("Error loading club seasons:", error);
        }
    };

    // Function to load club squad for a specific season
    const loadClubSquad = async (seasonId) => {
        setLoadingSquad(true);
        try {
            const response = await getClubSquadAPI(id, seasonId);
            if (response.data && Array.isArray(response.data)) {
                setSquad(response.data);
            }
        } catch (error) {
            console.error("Error loading club squad:", error);
        } finally {
            setLoadingSquad(false);
        }
    };

    // Function to load club transfers for a specific season
    const loadClubTransfers = async (seasonId) => {
        setLoadingTransfers(true);
        try {
            const response = await getClubTransfersAPI(id, seasonId);
            if (response.data && Array.isArray(response.data)) {
                setTransfers(response.data);
            }
        } catch (error) {
            console.error("Error loading club transfers:", error);
        } finally {
            setLoadingTransfers(false);
        }
    };

    // Show loading spinner while data is being fetched
    if (loading || !club) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: "30px" }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    {club.imagePath && (
                        <Card>
                            <div style={{ textAlign: "center" }}>
                                <img 
                                    src={getImageUrl(club.imagePath)} 
                                    alt={club.name}
                                    style={{ 
                                        maxWidth: "100%", 
                                        maxHeight: "300px",
                                        objectFit: "contain" 
                                    }}
                                />
                            </div>
                        </Card>
                    )}
                </Col>
                <Col xs={24} md={16}>
                    <Descriptions title="Club Details" bordered>
                        <Descriptions.Item label="Name">{club.name}</Descriptions.Item>
                        <Descriptions.Item label="Country">{club.country}</Descriptions.Item>
                        <Descriptions.Item label="Stadium">{club.stadiumName || "N/A"}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            {/* Tabs for Squad and Transfers */}
            <div style={{ marginTop: "30px" }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={[
                        {
                            key: "1",
                            label: "Squad",
                            children: (
                                <ClubSquad
                                    squad={squad}
                                    seasons={seasons}
                                    selectedSeason={selectedSeason}
                                    setSelectedSeason={setSelectedSeason}
                                    loading={loadingSquad}
                                />
                            ),
                        },
                        {
                            key: "2",
                            label: "Transfers",
                            children: (
                                <ClubTransferHistory
                                    transfers={transfers}
                                    seasons={seasons}
                                    selectedSeason={selectedSeason}
                                    setSelectedSeason={setSelectedSeason}
                                    loading={loadingTransfers}
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default ClientClubDetail;