// epl-web/src/components/admin/league/league.detail.jsx
import { useEffect, useState } from "react";
import { Descriptions, Spin, Row, Col, Card, Button, notification } from "antd";
import { useParams, Link } from "react-router-dom";
import { fetchLeagueDetailAPI, getImageUrl } from "../../../services/api.service.js";
import LeagueSeasonTable from "../league-season/league.season.table.jsx";
import CreateLeagueSeasonButton from "../league-season/create.league-season.button.jsx";

const AdminLeagueDetail = () => {
    const { id } = useParams();
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to load league details from API
    const loadLeagueDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchLeagueDetailAPI(id);
            if (response.data) {
                setLeague(response.data);
            }
        } catch (error) {
            console.error("Error loading league detail:", error);
            notification.error({
                message: "Error",
                description: "Failed to load league details"
            });
        } finally {
            setLoading(false);
        }
    };

    // Load league details when component mounts or ID changes
    useEffect(() => {
        loadLeagueDetail();
    }, [id]);

    // Show loading spinner while data is being fetched
    if (loading || !league) {
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
                    {league.imagePath && (
                        <Card>
                            <div style={{ textAlign: "center" }}>
                                <img 
                                    src={getImageUrl(league.imagePath)} 
                                    alt={league.name}
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
                    <Descriptions title="League Details" bordered>
                        <Descriptions.Item label="ID">{league.id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{league.name}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>League Seasons</h3>
                    <CreateLeagueSeasonButton league={league} onSuccess={loadLeagueDetail} />
                </div>

                <LeagueSeasonTable
                    league={league}
                    leagueSeasons={league.leagueSeasons || []}
                    onSuccess={loadLeagueDetail}
                />
            </div>
        </div>
    );
};

export default AdminLeagueDetail;