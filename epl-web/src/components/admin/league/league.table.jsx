import { useState, useEffect } from "react";
import { Button, Space, Table, Card, Image, Input } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchAllLeaguesAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";
import CreateLeagueModal from "./league.create.jsx";
import EditLeagueModal from "./league.edit.jsx";
import DeleteLeagueButton from "./league.delete.jsx";

const { Search } = Input;

const AdminLeagueTable = () => {

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLeague, setCurrentLeague] = useState(null);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [loading, setLoading] = useState(false);
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
                setData(response.data.result);
                setPagination({
                    current: response.data.meta.page,
                    pageSize: response.data.meta.pageSize,
                    total: response.data.meta.total
                });
            } else if (Array.isArray(response.data)) {
                setData(response.data);
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
        fetchLeagues({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            field: sorter.field,
            order: sorter.order
        });
    };

    const showCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const showEditModal = (league) => {
        setCurrentLeague(league);
        setIsEditModalOpen(true);
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchLeagues({ current: 1 });
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchLeagues({ current: pagination.current });
    };

    const handleDeleteSuccess = () => {
        fetchLeagues({ current: pagination.current });
    };

    const columns = [
        {
            title: "#",
            render: (_, __, index) => {
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            },
            width: 60
        },
        {
            title: "ID",
            dataIndex: "id",
        },
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
            title: "Name",
            dataIndex: "name",
            render: (text, record) => <Link to={`/admin/leagues/${record.id}`}>{text}</Link>,
            sorter: true
        },
        {
            title: "Actions",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showEditModal(record)}
                    />
                    <DeleteLeagueButton
                        leagueId={record.id}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                title="League Table"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showCreateModal}
                    >
                        Add League
                    </Button>
                }
            >
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
                    dataSource={data}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Card>

            <CreateLeagueModal
                isOpen={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditLeagueModal
                isOpen={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                league={currentLeague}
            />
        </>
    );
};

export default AdminLeagueTable;