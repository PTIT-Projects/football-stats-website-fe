import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {Table, Card, Alert, Button, Tag, Image, Input} from "antd";
import { fetchAllClubsWithPaginationAPI } from "../../../services/api.service.js";

const ClientClubTable = () => {
    const { Search } = Input;
    const [searchParams] = useSearchParams();
    const [filterInfo, setFilterInfo] = useState(null);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const country = searchParams.get('country');

    useEffect(() => {
        if (country) {
            setFilterInfo(`Filtering by: Country "${country}"`);
        } else {
            setFilterInfo(null);
        }
    }, [country]);

    const buildQueryParams = (params = {}, customSearchTerm) => {
        let filterParts = [];
        if (country) filterParts.push(`country : '${country}'`);
        const term = customSearchTerm !== undefined ? customSearchTerm : searchTerm;
        if (term) filterParts.push(`name ~ '${term}'`);
        return {
            page: params.current || pagination.current,
            size: params.pageSize || pagination.pageSize,
            filter: filterParts.length > 0 ? filterParts.join(' and ') : undefined
        };
    };

    const fetchClubs = async (params = {}, customSearchTerm) => {
        setLoading(true);
        try {
            const queryParams = buildQueryParams(params, customSearchTerm);
            const response = await fetchAllClubsWithPaginationAPI(queryParams);
            if (response.data && response.data.result) {
                setClubs(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            }
        } catch (error) {
            console.error("Failed to fetch clubs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        fetchClubs({ current: 1 }, value);
    };

    useEffect(() => {
        fetchClubs();
    }, [country]);

    const handleTableChange = (newPagination, filters, sorter) => {

        if (newPagination.current !== pagination.current ||
            newPagination.pageSize !== pagination.pageSize) {
            fetchClubs({
                current: newPagination.current,
                pageSize: newPagination.pageSize
            });
        }
    };

    const columns = [
        {
            title: "Logo",
            dataIndex: "imageUrl",
            key: "logo",
            width: 70,
            render: (imageUrl) => (
                <Image
                    src={imageUrl}
                    alt="Club Logo"
                    width={50}
                    height={50}
                    style={{ objectFit: 'contain' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                />
            )
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text, record) => <Link to={`/clubs/${record.id}`}>{text}</Link>,
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Country",
            dataIndex: "country",
            key: "country",
            render: (country) => (
                <Tag color="blue">
                    <Link to={`/clubs?country=${encodeURIComponent(country)}`}>
                        {country}
                    </Link>
                </Tag>
            ),
            sorter: (a, b) => a.country.localeCompare(b.country)
        },
        {
            title: "Stadium",
            dataIndex: "stadiumName",
            key: "stadiumName",
            sorter: (a, b) => a.stadiumName.localeCompare(b.stadiumName)
        }
    ];

    return (
        <>
            {filterInfo && (
                <Card style={{ marginBottom: 16 }}>
                    <Alert
                        message={filterInfo}
                        type="info"
                        showIcon
                        action={
                            <Button type="link" href="/clubs">Clear filters</Button>
                        }
                    />
                </Card>
            )}
            <Card title="Club Table">
                <div style={{ marginBottom: 16 }}>
                    <Search
                        placeholder="Search clubs by name"
                        allowClear
                        enterButton="Search"
                        size="large"
                        onSearch={handleSearch}
                        style={{ maxWidth: 500 }}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={clubs}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Card>
        </>
    );
};

export default ClientClubTable;