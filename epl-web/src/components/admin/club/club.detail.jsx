import { useEffect, useState } from "react";
import { Descriptions, Spin, Row, Col, Card } from "antd";
import { useParams } from "react-router-dom";
import { fetchClubDetailAPI, getImageUrl } from "../../../services/api.service.js";

const AdminClubDetail = () => {
    const { id } = useParams();
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load club details when component mounts
    useEffect(() => {
        loadClubDetail();
    }, [id]);

    // Function to load club details from API
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
                        <Descriptions.Item label="ID">{club.id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{club.name}</Descriptions.Item>
                        <Descriptions.Item label="Country">{club.country}</Descriptions.Item>
                        <Descriptions.Item label="Stadium Name">{club.stadiumName || 'N/A'}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>
        </div>
    );
};

export default AdminClubDetail;