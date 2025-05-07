import { useState, useContext } from "react";
import { Card, Table, Input, Image, Spin, Typography } from "antd";
import { fetchAllPlayersAPI, fetchAllClubsWithPaginationAPI, fetchAllCoachesAPI, fetchAllLeaguesAPI } from "../services/api.service.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/auth.context.jsx";

const { Search } = Input;
const { Title } = Typography;

const HomeGlobalSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [playerResults, setPlayerResults] = useState([]);
    const [clubResults, setClubResults] = useState([]);
    const [coachResults, setCoachResults] = useState([]);
    const [leagueResults, setLeagueResults] = useState([]);

    const { user } = useContext(AuthContext);
    const isAdmin = user && user.role === 'ADMIN';

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (!value) {
            setPlayerResults([]);
            setClubResults([]);
            setCoachResults([]);
            setLeagueResults([]);
            return;
        }
        setLoading(true);
        try {
            const playerPromise = fetchAllPlayersAPI({ page: 1, size: 10, filter: `name ~ '${value}'` });
            const clubPromise = fetchAllClubsWithPaginationAPI({ page: 1, size: 10, filter: `name ~ '${value}'` });
            const coachPromise = fetchAllCoachesAPI({ page: 1, size: 10, filter: `name ~ '${value}'` });
            const leaguePromise = fetchAllLeaguesAPI({ page: 1, size: 10, filter: `name ~ '${value}'` });
            const [playerRes, clubRes, coachRes, leagueRes] = await Promise.all([playerPromise, clubPromise, coachPromise, leaguePromise]);
            setPlayerResults(playerRes.data?.result || []);
            setClubResults(clubRes.data?.result || []);
            setCoachResults(coachRes.data?.result || []);
            setLeagueResults(leagueRes.data?.result || []);
        } catch (e) {
            setPlayerResults([]);
            setClubResults([]);
            setCoachResults([]);
            setLeagueResults([]);
        } finally {
            setLoading(false);
        }
    };

    const playerColumns = [
        { title: "Image", dataIndex: "imageUrl", width: 60, render: (url) => <Image src={url} width={40} height={40} style={{objectFit:'cover',borderRadius:8}} /> },
        { title: "Name", dataIndex: "name", render: (text, record) => <Link to={`/${isAdmin ? 'admin/players' : 'players'}/${record.id}`}>{text}</Link> },
        { title: "Age", dataIndex: "age" },
        { title: "Positions", dataIndex: "positions", render: (pos) => Array.isArray(pos) ? pos.join(', ') : pos },
    ];
    const clubColumns = [
        { title: "Logo", dataIndex: "imageUrl", width: 60, render: (url) => <Image src={url} width={40} height={40} style={{objectFit:'contain'}} /> },
        { title: "Name", dataIndex: "name", render: (text, record) => <Link to={`/${isAdmin ? 'admin/clubs' : 'clubs'}/${record.id}`}>{text}</Link> },
        { title: "Country", dataIndex: "country" },
    ];
    const coachColumns = [
        { title: "Image", dataIndex: "imageUrl", width: 60, render: (url) => <Image src={url} width={40} height={40} style={{objectFit:'cover',borderRadius:8}} /> },
        { title: "Name", dataIndex: "name", render: (text, record) => <Link to={`/${isAdmin ? 'admin/coaches' : 'coaches'}/${record.id}`}>{text}</Link> },
        { title: "Age", dataIndex: "age" },
    ];
    const leagueColumns = [
        { title: "Logo", dataIndex: "imageUrl", width: 60, render: (url) => <Image src={url} width={40} height={40} style={{objectFit:'contain'}} /> },
        { title: "Name", dataIndex: "name", render: (text, record) => <Link to={`/${isAdmin ? 'admin/leagues' : 'leagues'}/${record.id}`}>{text}</Link> },
    ];

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
            <Card>
                <Search
                    placeholder="Search player, club, coach, league by name"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={handleSearch}
                    loading={loading}
                />
            </Card>
            <Spin spinning={loading} tip="Searching...">
                {searchTerm && (
                    <>
                        <div style={{ marginTop: 32 }}>
                            <Title level={4}>Player Results</Title>
                            <Table columns={playerColumns} dataSource={playerResults} rowKey="id" pagination={false} size="small" />
                        </div>
                        <div style={{ marginTop: 32 }}>
                            <Title level={4}>Club Results</Title>
                            <Table columns={clubColumns} dataSource={clubResults} rowKey="id" pagination={false} size="small" />
                        </div>
                        <div style={{ marginTop: 32 }}>
                            <Title level={4}>Coach Results</Title>
                            <Table columns={coachColumns} dataSource={coachResults} rowKey="id" pagination={false} size="small" />
                        </div>
                        <div style={{ marginTop: 32 }}>
                            <Title level={4}>League Results</Title>
                            <Table columns={leagueColumns} dataSource={leagueResults} rowKey="id" pagination={false} size="small" />
                        </div>
                    </>
                )}
            </Spin>
        </div>
    );
};

export default HomeGlobalSearch;
