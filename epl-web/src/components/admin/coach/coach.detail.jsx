// epl-web/src/components/admin/coach/coach.detail.jsx
import { useEffect, useState } from "react";
import { Descriptions, Spin, Row, Col, Card } from "antd";
import { useParams } from "react-router-dom";
import { fetchCoachDetailAPI, getImageUrl } from "../../../services/api.service.js";
import CoachClubHistoryTable from "../coach-club/coach-club.history.table.jsx";
import CreateCoachClubButton from "../coach-club/create.coach-club.button.jsx";

const AdminCoachDetail = () => {
    const { id } = useParams();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load coach details when component mounts
    useEffect(() => {
        loadCoachDetail();
    }, [id]);

    // Function to load coach details from API
    const loadCoachDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchCoachDetailAPI(id);
            if (response.data) {
                setCoach(response.data);
            }
        } catch (error) {
            console.error("Error loading coach detail:", error);
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

    // Show loading spinner while data is being fetched
    if (loading || !coach) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
            </div>
        );
    }

    // Prepare coach club history columns
    const coachClubColumns = [
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render: date => formatDate(date)
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render: date => date ? formatDate(date) : "Present"
        },
        {
            title: "Club",
            key: "club",
            render: (_, record) => {
                if (typeof record.club === 'object' && record.club) {
                    return record.club.name;
                }
                return record.club || "-";
            }
        }
    ];

    return (
        <div style={{ padding: "30px" }}>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    {coach.imagePath && (
                        <Card>
                            <div style={{ textAlign: "center" }}>
                                <img 
                                    src={getImageUrl(coach.imagePath)} 
                                    alt={coach.name}
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
                    <Descriptions title="Head Coach Details" bordered>
                        <Descriptions.Item label="ID">{coach.id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{coach.name}</Descriptions.Item>
                        <Descriptions.Item label="Age">{coach.age}</Descriptions.Item>
                        <Descriptions.Item label="Date of Birth">{formatDate(coach.dob)}</Descriptions.Item>
                        <Descriptions.Item label="Citizenship">
                            {Array.isArray(coach.citizenships) ? coach.citizenships.join(', ') : coach.citizenships}
                        </Descriptions.Item>
                        <Descriptions.Item label="Current Club">
                            {coach.coachClubs && coach.coachClubs.length > 0 ?
                                (typeof coach.coachClubs[0].club === 'object' ?
                                    coach.coachClubs[0].club.name : coach.coachClubs[0].club) :
                                "No club"}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            <div style={{ marginTop: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>Clubs History</h3>
                    <CreateCoachClubButton coach={coach} onSuccess={loadCoachDetail}/>
                </div>

                <CoachClubHistoryTable
                    coachClubColumns={coachClubColumns}
                    coachClubs={coach.coachClubs || []}
                    coach={coach}
                    onSuccess={loadCoachDetail}
                    isAdmin={true}
                />
            </div>
        </div>
    );
};

export default AdminCoachDetail;