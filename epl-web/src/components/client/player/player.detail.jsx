// epl-web/src/components/client/player/player.detail.jsx
import { useEffect, useState } from "react";
import { Descriptions, Spin, Tag, Table, Row, Col, Card } from "antd";
import { useParams, Link } from "react-router-dom";
import { fetchPlayerDetailAPI, getImageUrl } from "../../../services/api.service.js";

const ClientPlayerDetail = () => {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load player details when component mounts
    useEffect(() => {
        loadPlayerDetail();
    }, [id]);

    // Function to fetch player details from API
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

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Create position tags with links
    const makePositionLinks = (positions) => {
        if (!positions) return "-";
        if (!Array.isArray(positions)) positions = [positions];

        return positions.map((position, index) => (
            <Tag key={index} color="blue" style={{marginRight: "5px"}}>
                <Link to={`/players?position=${encodeURIComponent(position)}`}>{position}</Link>
            </Tag>
        ));
    };

    // Create citizenship links
    const makeCitizenshipLinks = (citizenships) => {
        if (!citizenships) return "-";
        if (!Array.isArray(citizenships)) citizenships = [citizenships];

        return citizenships.map((country, index) => (
            <Tag key={index} color="green" style={{marginRight: "5px"}}>
                <Link to={`/players?citizenship=${encodeURIComponent(country)}`}>{country}</Link>
            </Tag>
        ));
    };

    // Get current club with link
    const getCurrentClub = () => {
        if (!player.transferHistories || player.transferHistories.length === 0) return "No club";

        const currentTransfer = player.transferHistories[0]; // Most recent transfer
        if (!currentTransfer) return "No club";

        if (typeof currentTransfer.newClub === 'object' && currentTransfer.newClub) {
            return (
                <Link to={`/clubs/${currentTransfer.newClub.id}`}>
                    {currentTransfer.newClub.name}
                </Link>
            );
        }

        return currentTransfer.newClub || "No club";
    };

    // Show loading spinner while data is being fetched
    if (loading || !player) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    // Define columns for the transfer history table
    const transferColumns = [
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
            render: date => formatDate(date)
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "From",
            key: "from",
            render: (_, record) => {
                if (record.previousClub) {
                    if (typeof record.previousClub === 'object') {
                        return <Link to={`/clubs/${record.previousClub.id}`}>{record.previousClub.name}</Link>;
                    }
                    return record.previousClub;
                }
                return "-";
            }
        },
        {
            title: "To",
            key: "to",
            render: (_, record) => {
                if (record.newClub) {
                    if (typeof record.newClub === 'object') {
                        return <Link to={`/clubs/${record.newClub.id}`}>{record.newClub.name}</Link>;
                    }
                    return record.newClub;
                }
                return "-";
            }
        },
        {
            title: "Value",
            dataIndex: "playerValue",
            key: "playerValue",
            render: value => value ? `€${value.toLocaleString()}m` : "-"
        },
        {
            title: "Fee",
            dataIndex: "fee",
            key: "fee",
            render: fee => fee ? `€${fee.toLocaleString()}m` : "-"
        }
    ];

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
                    {/* Player Details */}
                    <Descriptions title="Player Details" bordered>
                        <Descriptions.Item label="Name">{player.name}</Descriptions.Item>
                        <Descriptions.Item label="Age">{player.age}</Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">{formatDate(player.dob)}</Descriptions.Item>
                        <Descriptions.Item label="Positions">
                            {makePositionLinks(player.positions)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Citizenship">
                            {makeCitizenshipLinks(player.citizenships)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Current Club">
                            {getCurrentClub()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Market Value">
                            {player.marketValue ? `€${player.marketValue.toLocaleString()}m` : '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Shirt Number">
                            {player.shirtNumber || '-'}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            {/* Player Transfer History using Ant Design Table */}
            <div style={{ marginTop: "30px" }}>
                <h3>Transfer History</h3>
                <Table
                    columns={transferColumns}
                    dataSource={player.transferHistories || []}
                    rowKey={(record) => record.id || `${record.date}-${record.type}`}
                    pagination={false}
                    locale={{
                        emptyText: "No transfer history available"
                    }}
                />
            </div>
        </div>
    );
};

export default ClientPlayerDetail;