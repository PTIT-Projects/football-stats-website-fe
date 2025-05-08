import { useState, useEffect } from "react";
import { Table, Card, Image, Input } from "antd";
import { Link } from "react-router-dom";
import { fetchAllLeaguesAPI } from "../../../services/api.service.js";

const ClientLeagueTable = () => {
    const { Search } = Input;
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [searchTerm, setSearchTerm] = useState("");

    const buildQueryParams = (params = {}, customSearchTerm) => {
        let filterParts = [];
        const term = customSearchTerm !== undefined ? customSearchTerm : searchTerm;
        if (term) filterParts.push(`name ~ '${term}'`);
        return {
            page: params.current || pagination.current,
            size: params.pageSize || pagination.pageSize,
            filter: filterParts.length > 0 ? filterParts.join(' and ') : undefined
        };
    };

    const fetchLeagues = async (params = {}, customSearchTerm) => {
        setLoading(true);
        try {
            const queryParams = buildQueryParams(params, customSearchTerm);
            const response = await fetchAllLeaguesAPI(queryParams);
            if (response.data && response.data.result) {
                setLeagues(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            } else if (Array.isArray(response.data)) {
                setLeagues(response.data);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.length
                }));
            }

    
        } catch (error) {
            console.error("Failed to fetch leagues:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        fetchLeagues({ current: 1 }, value);
    };

    useEffect(() => {
        fetchLeagues();
    }, []);

    const handleTableChange = (newPagination, filters, sorter) => {
        if (newPagination.current !== pagination.current ||
            newPagination.pageSize !== pagination.pageSize) {
            fetchLeagues({
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
            width: 80,
            render: (imageUrl) => (
                <Image
                    src={imageUrl}
                    alt="League Logo"
                    width={50}
                    height={50}
                    style={{ objectFit: 'contain' }}
                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCY"
                />
            )
        },
        {
            title: "League",
            dataIndex: "name",
            key: "name",
            render: (text, record) => <Link to={`/leagues/${record.id}`}>{text}</Link>,
            sorter: (a, b) => a.name.localeCompare(b.name)
        }
    ];

    return (
        <Card title="League Table">
            <div style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search leagues by name"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={handleSearch}
                    style={{ maxWidth: 500 }}
                />
            </div>
            <Table
                columns={columns}
                dataSource={leagues}
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
    );
};

export default ClientLeagueTable;