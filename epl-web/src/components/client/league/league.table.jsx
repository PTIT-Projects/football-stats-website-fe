import { useState, useEffect } from "react";
import { Table, Card } from "antd";
import { Link } from "react-router-dom";
import { fetchAllLeaguesAPI } from "../../../services/api.service.js";

const ClientLeagueTable = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchLeagues = async (params = {}) => {
        setLoading(true);
        try {
            const response = await fetchAllLeaguesAPI({
                page: params.current || pagination.current,
                size: params.pageSize || pagination.pageSize
            });

            if (response.data && response.data.result) {
                setLeagues(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            } else if (Array.isArray(response.data)) {
                // Handle non-paginated response
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

    useEffect(() => {
        fetchLeagues();
    }, []);

    const handleTableChange = (newPagination, filters, sorter) => {
        // Only fetch new data when pagination changes
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
            title: "League",
            dataIndex: "name",
            key: "name",
            render: (text, record) => <Link to={`/leagues/${record.id}`}>{text}</Link>,
            sorter: (a, b) => a.name.localeCompare(b.name)
        }
    ];

    return (
        <Card title="League Table">
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