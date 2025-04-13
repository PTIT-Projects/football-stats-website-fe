// epl-web/src/components/client/club/club.squad.jsx
import React from 'react';
import { Table, Avatar, Spin, Empty } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getImageUrl } from '../../../services/api.service.js';

const ClubSquad = ({ squad, loading }) => {
  // Define columns for the squad table
  const columns = [
    {
      title: '',
      dataIndex: 'imagePath',
      key: 'avatar',
      width: 80,
      render: (imagePath) => (
        <Avatar 
          size={50} 
          src={imagePath ? getImageUrl(imagePath) : null}
          icon={!imagePath && <UserOutlined />}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      filters: [
        { text: 'Goalkeeper', value: 'Goalkeeper' },
        { text: 'Defender', value: 'Defender' },
        { text: 'Midfielder', value: 'Midfielder' },
        { text: 'Forward', value: 'Forward' },
      ],
      onFilter: (value, record) => record.position === value,
    },
    {
      title: 'Nationality',
      dataIndex: 'nationality',
      key: 'nationality',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Appearances',
      dataIndex: 'appearances',
      key: 'appearances',
      sorter: (a, b) => a.appearances - b.appearances,
    },
    {
      title: 'Goals',
      dataIndex: 'goals',
      key: 'goals',
      sorter: (a, b) => a.goals - b.goals,
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!squad || squad.length === 0) {
    return (
      <Empty 
        description="No squad data available for the selected season" 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Table 
      dataSource={squad.map((player, index) => ({ ...player, key: player.id || index }))} 
      columns={columns} 
      pagination={{ pageSize: 15 }}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default ClubSquad;