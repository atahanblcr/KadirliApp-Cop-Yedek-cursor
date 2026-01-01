import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Table,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Group,
  ActionIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import axiosClient from '../api/axiosClient';

interface Pharmacy {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  region: string;
  latitude: number | null;
  longitude: number | null;
}

function Pharmacies() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    region: '',
    latitude: '',
    longitude: '',
  });

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      // Note: Backend uses /pharmacy endpoint, calling without date to get all duty pharmacies
      // For admin panel, you may want to add a separate endpoint that returns all pharmacies
      const response = await axiosClient.get('/pharmacy');
      setPharmacies(response.data.data || []);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pharmacy?')) {
      return;
    }

    try {
      await axiosClient.delete(`/pharmacy/${id}`);
      fetchPharmacies(); // Refresh the list
    } catch (error) {
      console.error('Error deleting pharmacy:', error);
      alert('Failed to delete pharmacy');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare data - backend requires dutyDate, using today's date as default
      const today = new Date().toISOString().split('T')[0];
      await axiosClient.post('/pharmacy', {
        name: formData.name,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        region: formData.region,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        dutyDate: today, // Required field, using today as default
      });

      // Reset form and close modal
      setFormData({
        name: '',
        phone: '',
        address: '',
        region: '',
        latitude: '',
        longitude: '',
      });
      close();
      fetchPharmacies(); // Refresh the list
    } catch (error) {
      console.error('Error creating pharmacy:', error);
      alert('Failed to create pharmacy');
    }
  };

  const rows = pharmacies.map((pharmacy) => (
    <Table.Tr key={pharmacy.id}>
      <Table.Td>{pharmacy.name}</Table.Td>
      <Table.Td>{pharmacy.phone || '-'}</Table.Td>
      <Table.Td>{pharmacy.region}</Table.Td>
      <Table.Td>{pharmacy.address || '-'}</Table.Td>
      <Table.Td>
        <ActionIcon
          color="red"
          variant="light"
          onClick={() => handleDelete(pharmacy.id)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container>
      <Group justify="space-between" mb="md">
        <Title order={1}>Pharmacies</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          New Pharmacy
        </Button>
      </Group>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>District</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {loading ? (
            <Table.Tr>
              <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                Loading...
              </Table.Td>
            </Table.Tr>
          ) : rows.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                No pharmacies found
              </Table.Td>
            </Table.Tr>
          ) : (
            rows
          )}
        </Table.Tbody>
      </Table>

      <Modal opened={opened} onClose={close} title="New Pharmacy">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            placeholder="Enter pharmacy name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            mb="md"
          />
          <TextInput
            label="Phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            mb="md"
          />
          <TextInput
            label="District"
            placeholder="Enter district/region"
            required
            value={formData.region}
            onChange={(e) =>
              setFormData({ ...formData, region: e.target.value })
            }
            mb="md"
          />
          <TextInput
            label="Address"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            mb="md"
          />
          <NumberInput
            label="Latitude"
            placeholder="Enter latitude"
            decimalScale={7}
            value={formData.latitude ? parseFloat(formData.latitude) : undefined}
            onChange={(value) =>
              setFormData({ ...formData, latitude: value?.toString() || '' })
            }
            mb="md"
          />
          <NumberInput
            label="Longitude"
            placeholder="Enter longitude"
            decimalScale={7}
            value={
              formData.longitude ? parseFloat(formData.longitude) : undefined
            }
            onChange={(value) =>
              setFormData({ ...formData, longitude: value?.toString() || '' })
            }
            mb="md"
          />
          <Group justify="flex-end" mt="lg">
            <Button variant="subtle" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
}

export default Pharmacies;
