import { Table, Tag, Input, Button, Row, Col, Select, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSearchClubsAPI, getImageUrl } from '../../../services/api.service';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ClientClubTable = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filter states
    const [searchName, setSearchName] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');

    // Lists for filters
    const [leagues, setLeagues] = useState([]);
    const [countries, setCountries] = useState([]);

    // Load clubs data
    useEffect(() => {
        loadClubs();
    }, [pagination.current, pagination.pageSize, searchName, selectedLeague, selectedCountry]);

    const loadClubs = async () => {
        setLoading(true);
        try {
            const filters = {
                name: searchName || undefined,
                league: selectedLeague || undefined,
                country: selectedCountry || undefined,
                page: pagination.current - 1,
                size: pagination.pageSize
            };

            const response = await getSearchClubsAPI(filters);
            
            if (response.data) {
                setClubs(response.data.content);
                setPagination({
                    ...pagination,
                    total: response.data.totalElements
                });
                
                // Extract unique values for filters
                if (response.data.leagues) {
                    setLeagues(response.data.leagues);
                }
                if (response.data.countries) {
                    setCountries(response.data.countries);
                }
            }
        } catch (error) {
            console.error("Error loading clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle table pagination change
    const handleTableChange = (pagination) => {
        setPagination(pagination);
    };

    // Handle search button click
    const handleSearch = () => {
        setPagination({ ...pagination, current: 1 });
    };

    // Handle reset filters
    const handleReset = () => {
        setSearchName('');
        setSelectedLeague('');
        setSelectedCountry('');
        setPagination({ ...pagination, current: 1 });
    };

    // Table columns definition
    const columns = [
        {
            title: '',
            dataIndex: 'imagePath',
            key: 'image',
            width: '70px',
            render: (imagePath, record) => (
                <Link to={`/clubs/${record.id}`}>
                    <Avatar 
                        src={imagePath ? getImageUrl(imagePath) : null} 
                        size={50} 
                        alt={record.name}
                        shape="square"
                    >
                        {!imagePath ? record.name.charAt(0) : null}
                    </Avatar>
                </Link>
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/clubs/${record.id}`}>{text}</Link>
        },
        {
            title: 'League',
            key: 'currentLeague',
            dataIndex: 'currentLeague',
            render: (currentLeague) => currentLeague ? (
                <Link to={`/leagues/${currentLeague.id}`}>{currentLeague.name}</Link>
            ) : '-'
        },
        {
            title: 'Country',
            key: 'country',
            dataIndex: 'country',
            render: (country) => (
                <Tag color="blue">
                    {country}
                </Tag>
            ),
        },
        {
            title: 'Founded',
            dataIndex: 'foundedYear',
            key: 'founded',
        },
        {
            title: 'Stadium',
            dataIndex: 'stadium',
            key: 'stadium',
        },
    ];

    return (
        <div>
            {/* Filters */}
            <div style={{ marginBottom: 20 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Input 
                            placeholder="Search by name"
                            value={searchName}
                            onChange={e => setSearchName(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select 
                            placeholder="Filter by league"
                            style={{ width: '100%' }}
                            value={selectedLeague || undefined}
                            onChange={setSelectedLeague}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {leagues.map(league => (
                                <Option key={league.id} value={league.id}>{league.name}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select 
                            placeholder="Filter by country"
                            style={{ width: '100%' }}
                            value={selectedCountry || undefined}
                            onChange={setSelectedCountry}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {countries.map(country => (
                                <Option key={country} value={country}>{country}</Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />} style={{ marginRight: 8 }}>
                        Search
                    </Button>
                    <Button onClick={handleReset}>
                        Reset
                    </Button>
                </div>
            </div>

            {/* Clubs Table */}
            <Table 
                columns={columns} 
                dataSource={clubs}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
                loading={loading}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default ClientClubTable;