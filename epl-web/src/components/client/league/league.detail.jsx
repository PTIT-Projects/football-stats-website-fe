import { useEffect, useState } from "react";
import { Descriptions, Spin, Tabs, Table, Card, Row, Col, Badge, Button, Modal, Avatar } from "antd";
import { ArrowRightOutlined } from '@ant-design/icons';
import { useParams, Link } from "react-router-dom";
import { fetchLeagueDetailAPI, getImageUrl, getTopGoalScorerAPI, getTopAssistsAPI, getTopYellowCardsAPI, getTopRedCardsAPI } from "../../../services/api.service.js";
import LeagueSeasonSelect from "./league.season.select.jsx";

const ClientLeagueDetail = () => {
    const { id } = useParams();
    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [activeTab, setActiveTab] = useState("1");
    
    // State for statistics
    const [topScorers, setTopScorers] = useState([]);
    const [topAssists, setTopAssists] = useState([]);
    const [topYellowCards, setTopYellowCards] = useState([]);
    const [topRedCards, setTopRedCards] = useState([]);
    const [loadingStats, setLoadingStats] = useState(false);
    
    // Visibility state for statistics modals
    const [scorersModalVisible, setScorersModalVisible] = useState(false);
    const [assistsModalVisible, setAssistsModalVisible] = useState(false);
    const [yellowCardsModalVisible, setYellowCardsModalVisible] = useState(false);
    const [redCardsModalVisible, setRedCardsModalVisible] = useState(false);

    // Load league details when component mounts
    useEffect(() => {
        loadLeagueDetail();
    }, [id]);

    // Load statistics when selected season changes
    useEffect(() => {
        if (selectedSeason) {
            loadStatistics(selectedSeason);
        }
    }, [selectedSeason]);

    // Function to fetch league details from API
    const loadLeagueDetail = async () => {
        setLoading(true);
        try {
            const response = await fetchLeagueDetailAPI(id);
            if (response.data) {
                setLeague(response.data);
                
                // Set the most recent season as the default selected season
                if (response.data.leagueSeasons && response.data.leagueSeasons.length > 0) {
                    setSelectedSeason(response.data.leagueSeasons[0].id);
                }
            }
        } catch (error) {
            console.error("Error loading league detail:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to load all statistics for a specific season
    const loadStatistics = async (seasonId) => {
        setLoadingStats(true);
        try {
            await Promise.all([
                loadTopScorers(seasonId),
                loadTopAssists(seasonId),
                loadTopYellowCards(seasonId),
                loadTopRedCards(seasonId),
            ]);
        } catch (error) {
            console.error("Error loading statistics:", error);
        } finally {
            setLoadingStats(false);
        }
    };

    // Function to load top goal scorers for a specific season
    const loadTopScorers = async (seasonId) => {
        try {
            const response = await getTopGoalScorerAPI(seasonId);
            if (response.data) {
                setTopScorers(response.data);
            }
        } catch (error) {
            console.error("Error loading top scorers:", error);
            setTopScorers([]);
        }
    };

    // Function to load top assists for a specific season
    const loadTopAssists = async (seasonId) => {
        try {
            const response = await getTopAssistsAPI(seasonId);
            if (response.data) {
                setTopAssists(response.data);
            }
        } catch (error) {
            console.error("Error loading top assists:", error);
            setTopAssists([]);
        }
    };

    // Function to load top yellow cards for a specific season
    const loadTopYellowCards = async (seasonId) => {
        try {
            const response = await getTopYellowCardsAPI(seasonId);
            if (response.data) {
                setTopYellowCards(response.data);
            }
        } catch (error) {
            console.error("Error loading top yellow cards:", error);
            setTopYellowCards([]);
        }
    };

    // Function to load top red cards for a specific season
    const loadTopRedCards = async (seasonId) => {
        try {
            const response = await getTopRedCardsAPI(seasonId);
            if (response.data) {
                setTopRedCards(response.data);
            }
        } catch (error) {
            console.error("Error loading top red cards:", error);
            setTopRedCards([]);
        }
    };

    // Columns for statistics tables
    const scorersColumns = [
        {
            title: "Player",
            key: "player",
            render: (_, record) => (
                <Link to={`/players/${record.player.id}`}>
                    {record.player.name}
                </Link>
            ),
        },
        {
            title: "Club",
            key: "club",
            render: (_, record) => (
                record.club ? (
                    <Link to={`/clubs/${record.club.id}`}>
                        {record.club.name}
                    </Link>
                ) : "-"
            ),
        },
        {
            title: "Goals",
            dataIndex: "goals",
            key: "goals",
        },
    ];

    const assistsColumns = [
        {
            title: "Player",
            key: "player",
            render: (_, record) => (
                <Link to={`/players/${record.player.id}`}>
                    {record.player.name}
                </Link>
            ),
        },
        {
            title: "Club",
            key: "club",
            render: (_, record) => (
                record.club ? (
                    <Link to={`/clubs/${record.club.id}`}>
                        {record.club.name}
                    </Link>
                ) : "-"
            ),
        },
        {
            title: "Assists",
            dataIndex: "assists",
            key: "assists",
        },
    ];

    const yellowCardsColumns = [
        {
            title: "Player",
            key: "player",
            render: (_, record) => (
                <Link to={`/players/${record.player.id}`}>
                    {record.player.name}
                </Link>
            ),
        },
        {
            title: "Club",
            key: "club",
            render: (_, record) => (
                record.club ? (
                    <Link to={`/clubs/${record.club.id}`}>
                        {record.club.name}
                    </Link>
                ) : "-"
            ),
        },
        {
            title: "Yellow Cards",
            dataIndex: "yellowCards",
            key: "yellowCards",
        },
    ];

    const redCardsColumns = [
        {
            title: "Player",
            key: "player",
            render: (_, record) => (
                <Link to={`/players/${record.player.id}`}>
                    {record.player.name}
                </Link>
            ),
        },
        {
            title: "Club",
            key: "club",
            render: (_, record) => (
                record.club ? (
                    <Link to={`/clubs/${record.club.id}`}>
                        {record.club.name}
                    </Link>
                ) : "-"
            ),
        },
        {
            title: "Red Cards",
            dataIndex: "redCards",
            key: "redCards",
        },
    ];

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
                        <Descriptions.Item label="Name">{league.name}</Descriptions.Item>
                    </Descriptions>
                </Col>
            </Row>

            <div style={{ marginTop: "20px" }}>
                <LeagueSeasonSelect 
                    leagues={[league]} 
                    value={selectedSeason} 
                    onChange={setSelectedSeason}
                    showLeague={false}
                />
            </div>

            {/* League Season Content */}
            <div style={{ marginTop: "30px" }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={[
                        {
                            key: "1",
                            label: "Table",
                            children: selectedSeason && (
                                <LeagueTable 
                                    seasonId={selectedSeason} 
                                    loading={loadingStats} 
                                />
                            ),
                        },
                        {
                            key: "2",
                            label: "Matches",
                            children: selectedSeason && (
                                <LeagueMatches 
                                    seasonId={selectedSeason} 
                                    loading={loadingStats} 
                                />
                            ),
                        },
                        {
                            key: "3",
                            label: "Statistics",
                            children: selectedSeason && (
                                <div>
                                    <Row gutter={[16, 16]}>
                                        {/* Top Scorers Card */}
                                        <Col xs={24} sm={12} lg={6}>
                                            <Card 
                                                title="Top Goal Scorers" 
                                                loading={loadingStats}
                                                extra={topScorers.length > 0 && (
                                                    <Button 
                                                        type="link" 
                                                        onClick={() => setScorersModalVisible(true)}
                                                        icon={<ArrowRightOutlined />}
                                                    >
                                                        See Full List
                                                    </Button>
                                                )}
                                            >
                                                {topScorers.length > 0 ? (
                                                    <div>
                                                        {topScorers.slice(0, 5).map((scorer, index) => (
                                                            <div key={index} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                                                                <div>
                                                                    <Badge count={index + 1} style={{ backgroundColor: index === 0 ? '#f5222d' : '#1890ff' }} />
                                                                    <Link to={`/players/${scorer.player.id}`} style={{ marginLeft: 8 }}>
                                                                        {scorer.player.name}
                                                                    </Link>
                                                                </div>
                                                                <div>{scorer.goals}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>No goal scorer statistics available</div>
                                                )}
                                            </Card>
                                        </Col>

                                        {/* Top Assists Card */}
                                        <Col xs={24} sm={12} lg={6}>
                                            <Card 
                                                title="Top Assists" 
                                                loading={loadingStats}
                                                extra={topAssists.length > 0 && (
                                                    <Button 
                                                        type="link" 
                                                        onClick={() => setAssistsModalVisible(true)}
                                                        icon={<ArrowRightOutlined />}
                                                    >
                                                        See Full List
                                                    </Button>
                                                )}
                                            >
                                                {topAssists.length > 0 ? (
                                                    <div>
                                                        {topAssists.slice(0, 5).map((assist, index) => (
                                                            <div key={index} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                                                                <div>
                                                                    <Badge count={index + 1} style={{ backgroundColor: index === 0 ? '#f5222d' : '#1890ff' }} />
                                                                    <Link to={`/players/${assist.player.id}`} style={{ marginLeft: 8 }}>
                                                                        {assist.player.name}
                                                                    </Link>
                                                                </div>
                                                                <div>{assist.assists}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>No assists statistics available</div>
                                                )}
                                            </Card>
                                        </Col>

                                        {/* Top Yellow Cards Card */}
                                        <Col xs={24} sm={12} lg={6}>
                                            <Card 
                                                title="Top Yellow Cards" 
                                                loading={loadingStats}
                                                extra={topYellowCards.length > 0 && (
                                                    <Button 
                                                        type="link" 
                                                        onClick={() => setYellowCardsModalVisible(true)}
                                                        icon={<ArrowRightOutlined />}
                                                    >
                                                        See Full List
                                                    </Button>
                                                )}
                                            >
                                                {topYellowCards.length > 0 ? (
                                                    <div>
                                                        {topYellowCards.slice(0, 5).map((card, index) => (
                                                            <div key={index} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                                                                <div>
                                                                    <Badge count={index + 1} style={{ backgroundColor: index === 0 ? '#f5222d' : '#1890ff' }} />
                                                                    <Link to={`/players/${card.player.id}`} style={{ marginLeft: 8 }}>
                                                                        {card.player.name}
                                                                    </Link>
                                                                </div>
                                                                <div>{card.yellowCards}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>No yellow cards statistics available</div>
                                                )}
                                            </Card>
                                        </Col>

                                        {/* Top Red Cards Card */}
                                        <Col xs={24} sm={12} lg={6}>
                                            <Card 
                                                title="Top Red Cards" 
                                                loading={loadingStats}
                                                extra={topRedCards.length > 0 && (
                                                    <Button 
                                                        type="link" 
                                                        onClick={() => setRedCardsModalVisible(true)}
                                                        icon={<ArrowRightOutlined />}
                                                    >
                                                        See Full List
                                                    </Button>
                                                )}
                                            >
                                                {topRedCards.length > 0 ? (
                                                    <div>
                                                        {topRedCards.slice(0, 5).map((card, index) => (
                                                            <div key={index} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between" }}>
                                                                <div>
                                                                    <Badge count={index + 1} style={{ backgroundColor: index === 0 ? '#f5222d' : '#1890ff' }} />
                                                                    <Link to={`/players/${card.player.id}`} style={{ marginLeft: 8 }}>
                                                                        {card.player.name}
                                                                    </Link>
                                                                </div>
                                                                <div>{card.redCards}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>No red cards statistics available</div>
                                                )}
                                            </Card>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        }
                    ]}
                />
            </div>

            {/* Top Scorers Modal */}
            <Modal
                title="Top Goal Scorers"
                open={scorersModalVisible}
                onCancel={() => setScorersModalVisible(false)}
                footer={null}
                width={800}
            >
                <Table
                    columns={scorersColumns}
                    dataSource={topScorers}
                    rowKey={(record) => `${record.player.id}-goals`}
                    pagination={false}
                    locale={{
                        emptyText: "No goal scorer statistics available"
                    }}
                />
            </Modal>

            {/* Top Assists Modal */}
            <Modal
                title="Top Assists"
                open={assistsModalVisible}
                onCancel={() => setAssistsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Table
                    columns={assistsColumns}
                    dataSource={topAssists}
                    rowKey={(record) => `${record.player.id}-assists`}
                    pagination={false}
                    locale={{
                        emptyText: "No assists statistics available"
                    }}
                />
            </Modal>

            {/* Top Yellow Cards Modal */}
            <Modal
                title="Top Yellow Cards"
                open={yellowCardsModalVisible}
                onCancel={() => setYellowCardsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Table
                    columns={yellowCardsColumns}
                    dataSource={topYellowCards}
                    rowKey={(record) => `${record.player.id}-yellow`}
                    pagination={false}
                    locale={{
                        emptyText: "No yellow cards statistics available"
                    }}
                />
            </Modal>

            {/* Top Red Cards Modal */}
            <Modal
                title="Top Red Cards"
                open={redCardsModalVisible}
                onCancel={() => setRedCardsModalVisible(false)}
                footer={null}
                width={800}
            >
                <Table
                    columns={redCardsColumns}
                    dataSource={topRedCards}
                    rowKey={(record) => `${record.player.id}-red`}
                    pagination={false}
                    locale={{
                        emptyText: "No red cards statistics available"
                    }}
                />
            </Modal>
        </div>
    );
};

export default ClientLeagueDetail;