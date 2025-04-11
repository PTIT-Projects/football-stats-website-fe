// epl-web/src/components/admin/player/player.detail.jsx
import { useEffect, useState } from "react";
import { Descriptions, Spin, Row, Col, Card } from "antd";
import { useParams } from "react-router-dom";
import { fetchPlayerDetailAPI } from "../../../services/api.service.js";
import TransferHistoryTable from "../transfer-history/transfer.history.table.jsx";
import CreateTransferButton from "../transfer-history/create.transfer.button.jsx";

const AdminPlayerDetail = () => {
    const { id } = useParams(); // Get player ID from URL
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load player details when component mounts
    useEffect(() => {
        loadPlayerDetail();
    }, [id]);

    // Function to load player details from API
    const loadPlayerDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchPlayerDetailAPI(id);
            if (response.data) {
                setPlayer(response.data);
            }
        } catch (error) {
            console.error("Error loading player detail:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Function to get image URL
    const getImageUrl = (path) => {
        return `/images/${path}`;
    };

    // Show loading spinner while data is being fetched
    if (loading || !player) {
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
                    {player.imagePath && (
                        <Card>
                            <div style={{ textAlign: "center" }}>
                                <img 
                                    src={getImageUrl(player.imagePath)} 
                                    alt={player.name}
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
                    <Descriptions title="Player Details" bordered>
                        <Descriptions.Item label="ID">{player.id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{player.name}</Descriptions.Item>
                        <Descriptions.Item label="Age">{player.age}</Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">{formatDate(player.dob)}</Descriptions.Item>
                        <Descriptions.Item label="Market Value">€{player.marketValue?.toLocaleString() || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Shirt Number">{player.shirtNumber || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Positions" span={3}>
                            {Array.isArray(player.positions) ? player.positions.join(', ') : player.positions}
                        </Descriptions.Item>
                        <Descriptions.Item label="Citizenships" span={3}>
                            {Array.isArray(player.citizenships) ? player.citizenships.join(', ') : player.citizenships}
                        </Descriptions.Item>
                        <Descriptions.Item label="Current Club" span={3}>
                            {player.transferHistories && player.transferHistories.length > 0 ?
                                (typeof player.transferHistories[0].newClub === 'object' ?
                                    player.transferHistories[0].newClub.name : player.transferHistories[0].newClub) :
                                "No club"}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Transfer History</h3>
                    <CreateTransferButton player={player} onSuccess={loadPlayerDetail} />
                </div>

                <TransferHistoryTable
                    player={player}
                    transferHistories={player.transferHistories || []}
                    onSuccess={loadPlayerDetail}
                    isAdmin={true}
                />
            </div>
        </div>
    );
};

export default AdminPlayerDetail;