import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Space, message, Typography } from 'antd';
import { apiService } from '../../../services/api.service';
import CreateTransferHistoryButton from './create.transfer.history.button';
import EditTransferHistoryButton from './edit.transfer.history.button';

const { Title } = Typography;

const ClubTransferHistory = ({ clubId }) => {
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransferHistory = async () => {
    setLoading(true);
    try {
      const response = await apiService.get(`/transfer-history/club/${clubId}`);
      setTransferHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch transfer history:', error);
      message.error('Failed to load club transfer history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clubId) {
      fetchTransferHistory();
    }
  }, [clubId]);

  const handleDelete = async (id) => {
    try {
      await apiService.delete(`/transfer-history/${id}`);
      message.success('Transfer history record deleted successfully');
      fetchTransferHistory();
    } catch (error) {
      console.error('Failed to delete transfer history record:', error);
      message.error('Failed to delete transfer history record');
    }
  };

  const columns = [
    {
      title: 'Player',
      dataIndex: ['player', 'name'],
      key: 'player',
    },
    {
      title: 'From Club',
      dataIndex: ['fromClub', 'name'],
      key: 'fromClub',
      render: (text, record) => record.fromClub?.name || 'N/A',
    },
    {
      title: 'To Club',
      dataIndex: ['toClub', 'name'],
      key: 'toClub',
      render: (text, record) => record.toClub?.name || 'N/A',
    },
    {
      title: 'Transfer Date',
      dataIndex: 'transferDate',
      key: 'transferDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      render: (fee) => (fee ? `${fee.toLocaleString()} €` : 'Free Transfer'),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditTransferHistoryButton
            transferRecord={record}
            onSuccess={fetchTransferHistory}
          />
          <Popconfirm
            title="Are you sure you want to delete this transfer record?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4}>Transfer History</Title>
        <CreateTransferHistoryButton clubId={clubId} onSuccess={fetchTransferHistory} />
      </div>
      <Table
        columns={columns}
        dataSource={transferHistory}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ClubTransferHistory;