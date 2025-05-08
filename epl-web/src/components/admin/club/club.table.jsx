import { useState, useEffect } from "react";
import { Button, Space, Table, Card, Image, Input } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchAllClubsWithPaginationAPI } from "../../../services/api.service.js";
import { Link } from "react-router-dom";
import CreateClubModal from "./club.create.jsx";
import EditClubModal from "./club.edit.jsx";
import DeleteClubButton from "./club.delete.jsx";

const { Search } = Input;

const AdminClubTable = () => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentClub, setCurrentClub] = useState(null);

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

    const fetchClubs = async (params = {}, customSearchTerm) => {
        setLoading(true);
        try {
            const queryParams = buildQueryParams(params, customSearchTerm);
            const response = await fetchAllClubsWithPaginationAPI(queryParams);
            if (response.data && response.data.result) {
                setData(response.data.result);
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
    }, []);

    const handleTableChange = (newPagination) => {
        fetchClubs({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

    const handleCreateSuccess = () => {
        setIsCreateModalOpen(false);
        fetchClubs({ current: 1 });
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchClubs({ current: pagination.current });
    };

    const handleDeleteSuccess = () => {
        fetchClubs({ current: pagination.current });
    };

    const columns = [
        {
            title: "#",
            render: (_, __, index) =>
                (pagination.current - 1) * pagination.pageSize + index + 1,
            width: 60,
        },
        {
            title: "ID",
            dataIndex: "id"
        },
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
            render: (text, record) => (
                <Link to={`/admin/clubs/${record.id}`}>{text}</Link>
            ),
        },
        {
            title: "Country",
            dataIndex: "country",
        },
        {
            title: "Stadium Name",
            dataIndex: "stadiumName",
        },
        {
            title: "Actions",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => {
                            setCurrentClub(record);
                            setIsEditModalOpen(true);
                        }}
                    />
                    <DeleteClubButton
                        clubId={record.id}
                        onSuccess={handleDeleteSuccess}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Card
                title="Club Table"
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Add Club
                    </Button>
                }
            >
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
                    dataSource={data}
                    rowKey="id"
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Card>

            <CreateClubModal
                isOpen={isCreateModalOpen}
                onCancel={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <EditClubModal
                isOpen={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
                club={currentClub}
            />
        </>
    );
};

export default AdminClubTable;