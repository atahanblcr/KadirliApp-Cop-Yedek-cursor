import { Container, Title, Text } from '@mantine/core';

function Dashboard() {
  return (
    <Container>
      <Title order={1} mb="md">
        Dashboard
      </Title>
      <Text c="dimmed">Welcome to the Admin Dashboard</Text>
    </Container>
  );
}

export default Dashboard;

