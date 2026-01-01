import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  ActionIcon,
  Image,
  Badge,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import axiosClient from '../api/axiosClient';

interface Ad {
  id: string;
  title: string;
  description: string | null;
  type: string;
  contactInfo: string | null;
  price: string | null;
  imageUrls: string[];
  sellerName: string | null;
  createdAt: string;
  updatedAt: string;
}

function Ads() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/ads');
      setAds(response.data.data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    try {
      await axiosClient.delete(`/ads/${id}`);
      fetchAds(); // Refresh the list
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Failed to delete ad');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      second_hand: 'blue',
      zero_product: 'green',
      real_estate: 'orange',
      vehicle: 'red',
      service: 'purple',
      spare_parts: 'cyan',
    };
    return colors[type] || 'gray';
  };

  const formatType = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const rows = ads.map((ad) => (
    <Table.Tr key={ad.id}>
      <Table.Td>
        {ad.imageUrls && ad.imageUrls.length > 0 && ad.imageUrls[0] ? (
          <Image
            src={ad.imageUrls[0]}
            alt={ad.title}
            width={60}
            height={60}
            fit="cover"
            radius="sm"
          />
        ) : (
          <Badge color="gray" variant="light">
            No Image
          </Badge>
        )}
      </Table.Td>
      <Table.Td>{ad.title}</Table.Td>
      <Table.Td>{ad.price || '-'}</Table.Td>
      <Table.Td>
        <Badge color={getTypeColor(ad.type)} variant="light">
          {formatType(ad.type)}
        </Badge>
      </Table.Td>
      <Table.Td>{ad.contactInfo || '-'}</Table.Td>
      <Table.Td>
        <ActionIcon
          color="red"
          variant="light"
          onClick={() => handleDelete(ad.id)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container>
      <Title order={1} mb="md">
        Ads
      </Title>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Image</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Contact Info</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                Loading...
              </Table.Td>
            </Table.Tr>
          ) : rows.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                No ads found
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

export default Ads;

