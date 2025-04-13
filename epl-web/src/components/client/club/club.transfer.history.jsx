// epl-web/src/components/client/club/club.transfer.history.jsx
import React from 'react';
import { Table, Tag, Spin, Empty } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

const ClubTransferHistory = ({ transfers, loading }) => {
  // Define columns for the transfer history table
  const columns = [
    {
      title: 'Season',
      dataIndex: 'season',
      key: 'season',
      sorter: (a, b) => a.season.localeCompare(b.season),
    },
    {
      title: 'Player',
      dataIndex: 'playerName',
      key: 'playerName',
      sorter: (a, b) => a.playerName.localeCompare(b.playerName),
    },
    {
      title: 'Transfer',
      key: 'transfer',
      render: (_, record) => (
        <span>
          {record.fromClub || 'Unknown'}
          <ArrowRightOutlined style={{ margin: '0 8px' }} />
          {record.toClub || 'Unknown'}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'transferType',
      key: 'transferType',
      render: (type) => {
        let color = 'blue';
        if (type === 'Loan') color = 'green';
        if (type === 'Free') color = 'orange';
        return <Tag color={color}>{type}</Tag>;
      },
      filters: [
        { text: 'Permanent', value: 'Permanent' },
        { text: 'Loan', value: 'Loan' },
        { text: 'Free', value: 'Free' },
      ],
      onFilter: (value, record) => record.transferType === value,
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      sorter: (a, b) => {
        const feeA = a.fee ? parseFloat(a.fee.replace(/[^0-9.-]+/g, '')) : 0;
        const feeB = b.fee ? parseFloat(b.fee.replace(/[^0-9.-]+/g, '')) : 0;
        return feeA - feeB;
      },
    },
    {
      title: 'Date',
      dataIndex: 'transferDate',
      key: 'transferDate',
      sorter: (a, b) => new Date(a.transferDate) - new Date(b.transferDate),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!transfers || transfers.length === 0) {
    return (
      <Empty 
        description="No transfer history available" 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Table 
      dataSource={transfers.map((transfer, index) => ({ ...transfer, key: transfer.id || index }))} 
      columns={columns} 
      pagination={{ pageSize: 10 }}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default ClubTransferHistory;