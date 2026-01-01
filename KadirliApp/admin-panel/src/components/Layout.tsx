import { AppShell, Burger, Group, NavLink, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconMedicineSyrup, IconAd, IconUsers, IconLogout } from '@tabler/icons-react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={700} size="lg">KadirliApp Admin</Text>
          </Group>
          <Button variant="subtle" color="red" leftSection={<IconLogout size={20}/>} onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink 
            label="Dashboard" 
            leftSection={<IconDashboard size={20} />} 
            active={location.pathname === '/'}
            onClick={() => navigate('/')} 
        />
        <NavLink 
            label="Eczaneler" 
            leftSection={<IconMedicineSyrup size={20} />} 
            active={location.pathname === '/pharmacies'}
            onClick={() => navigate('/pharmacies')} 
        />
        <NavLink 
            label="İlanlar" 
            leftSection={<IconAd size={20} />} 
            active={location.pathname === '/ads'}
            onClick={() => navigate('/ads')} 
        />
        <NavLink 
            label="Kullanıcılar" 
            leftSection={<IconUsers size={20} />} 
            active={location.pathname === '/users'}
            onClick={() => navigate('/users')} 
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}