import { useState, useEffect } from 'react';
import { Container, Title, Table, Loader, Center } from '@mantine/core';
import axiosClient from '../api/axiosClient';

interface User {
  id: string;
  phone: string | null;
  createdAt: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/users');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>{user.phone || '-'}</Table.Td>
      <Table.Td>{formatDate(user.createdAt)}</Table.Td>
      <Table.Td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
        {user.id}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container>
      <Title order={1} mb="md">
        Users
      </Title>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th>ID</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Center>
                  <Loader size="sm" />
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : rows.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={3} style={{ textAlign: 'center' }}>
                No users found
              </Table.Td>
            </Table.Tr>
          ) : (
            rows
          )}
        </Table.Tbody>
      </Table>
    </Container>
  );
}

export default Users;

