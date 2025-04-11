import { Table, Tag, Input, Button, Row, Col, Select, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSearchLeaguesAPI, getImageUrl } from '../../../services/api.service';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ClientLeagueTable = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filter states
    const [searchName, setSearchName] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedTier, setSelectedTier] = useState('');

    // Lists for filters
    const [countries, setCountries] = useState([]);
    const [tiers, setTiers] = useState([1, 2, 3, 4, 5]);

    // Load leagues data
    useEffect(() => {
        loadLeagues();
    }, [pagination.current, pagination.pageSize, searchName, selectedCountry, selectedTier]);

    const loadLeagues = async () => {
        setLoading(true);
        try {
            const filters = {
                name: searchName || undefined,
                country: selectedCountry || undefined,
                tier: selectedTier || undefined,
                page: pagination.current - 1,
                size: pagination.pageSize
            };

            const response = await getSearchLeaguesAPI(filters);
            
            if (response.data) {
                setLeagues(response.data.content);
                setPagination({
                    ...pagination,
                    total: response.data.totalElements
                });
                
                // Extract unique values for filters
                if (response.data.countries) {
                    setCountries(response.data.countries);
                }
            }
        } catch (error) {
            console.error("Error loading leagues:", error);
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
        setSelectedCountry('');
        setSelectedTier('');
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
                <Link to={`/leagues/${record.id}`}>
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
            render: (text, record) => <Link to={`/leagues/${record.id}`}>{text}</Link>
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
            title: 'Tier',
            dataIndex: 'tier',
            key: 'tier',
            width: '80px',
        },
        {
            title: 'Teams',
            dataIndex: 'numberOfTeams',
            key: 'teams',
            width: '80px',
        },
        {
            title: 'Current Season',
            dataIndex: 'currentSeason',
            key: 'currentSeason',
            render: (currentSeason) => currentSeason ? currentSeason.name : '-'
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
                    <Col xs={24} sm={12} md={8}>
                        <Select 
                            placeholder="Filter by tier"
                            style={{ width: '100%' }}
                            value={selectedTier || undefined}
                            onChange={setSelectedTier}
                            allowClear
                        >
                            {tiers.map(tier => (
                                <Option key={tier} value={tier}>{tier}</Option>
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

            {/* Leagues Table */}
            <Table 
                columns={columns} 
                dataSource={leagues}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
                loading={loading}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default ClientLeagueTable;