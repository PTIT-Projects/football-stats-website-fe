import { Table, Tag, Input, Button, Row, Col, Select, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSearchCoachesAPI, getImageUrl } from '../../../services/api.service';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const ClientCoachTable = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Filter states
    const [searchName, setSearchName] = useState('');
    const [selectedClub, setSelectedClub] = useState('');
    const [selectedNationality, setSelectedNationality] = useState('');

    // Lists for filters
    const [clubs, setClubs] = useState([]);
    const [nationalities, setNationalities] = useState([]);

    // Load coaches data
    useEffect(() => {
        loadCoaches();
    }, [pagination.current, pagination.pageSize, searchName, selectedClub, selectedNationality]);

    const loadCoaches = async () => {
        setLoading(true);
        try {
            const filters = {
                name: searchName || undefined,
                club: selectedClub || undefined,
                nationality: selectedNationality || undefined,
                page: pagination.current - 1,
                size: pagination.pageSize
            };

            const response = await getSearchCoachesAPI(filters);
            
            if (response.data) {
                setCoaches(response.data.content);
                setPagination({
                    ...pagination,
                    total: response.data.totalElements
                });
                
                // Extract unique values for filters
                if (response.data.clubs) {
                    setClubs(response.data.clubs);
                }
                if (response.data.nationalities) {
                    setNationalities(response.data.nationalities);
                }
            }
        } catch (error) {
            console.error("Error loading coaches:", error);
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
        setSelectedClub('');
        setSelectedNationality('');
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
                <Link to={`/coaches/${record.id}`}>
                    <Avatar 
                        src={imagePath ? getImageUrl(imagePath) : null} 
                        size={50} 
                        alt={record.name}
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
            render: (text, record) => <Link to={`/coaches/${record.id}`}>{text}</Link>
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            width: '80px',
        },
        {
            title: 'Current Club',
            key: 'currentClub',
            dataIndex: 'currentClub',
            render: (currentClub) => currentClub ? (
                <Link to={`/clubs/${currentClub.id}`}>{currentClub.name}</Link>
            ) : 'No club'
        },
        {
            title: 'Nationality',
            key: 'citizenship',
            dataIndex: 'citizenships',
            render: (citizenships) => (
                <>
                    {Array.isArray(citizenships) ? citizenships.map((citizenship, index) => (
                        <Tag color="green" key={index}>
                            {citizenship}
                        </Tag>
                    )) : citizenships && (
                        <Tag color="green">
                            {citizenships}
                        </Tag>
                    )}
                </>
            ),
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
                            placeholder="Filter by club"
                            style={{ width: '100%' }}
                            value={selectedClub || undefined}
                            onChange={setSelectedClub}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {clubs.map(club => (
                                <Option key={club.id} value={club.id}>{club.name}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select 
                            placeholder="Filter by nationality"
                            style={{ width: '100%' }}
                            value={selectedNationality || undefined}
                            onChange={setSelectedNationality}
                            allowClear
                            showSearch
                            optionFilterProp="children"
                        >
                            {nationalities.map(nationality => (
                                <Option key={nationality} value={nationality}>{nationality}</Option>
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

            {/* Coaches Table */}
            <Table 
                columns={columns} 
                dataSource={coaches}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
                loading={loading}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default ClientCoachTable;