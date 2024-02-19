import React from 'react';
import './styles/App.css';
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Settings from "./views/Settings";
import VoiceField from "./views/VoiceField";
import {socket} from "./socket";
import { AppShell, Badge, Burger, Center, Container, Flex, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TbAlpha, TbChartGridDots, TbMusicSearch, TbSettings } from 'react-icons/tb';

export default function App() {
  const [opened, {toggle}] = useDisclosure();

  return (
    <AppShell header={{height:60}} navbar={{width: 150, breakpoint:"sm", collapsed: {mobile: !opened}}} padding="md">
      <AppShell.Header>
        <Flex justify="flex-start" align="center">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Container w={70} ml={-5} mr={-10} mt={10}>
            <TbChartGridDots size={"100%"} color='#1C7ED6'/>
          </Container>
          <Text fw={500} size='xl'>
            Stimmfeldanalyse
          </Text>
          <Badge
            rightSection={<TbAlpha />} 
            size="sm" 
            variant='gradient' 
            gradient={{ from: 'blue', to: 'green', deg: 90 }} 
            ml={10} 
            mt={5}
          >
            Alpha
          </Badge>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <NavLink href="/" label="Einstellung" leftSection={<TbSettings />}/>
        <NavLink href='/field' label="Stimmfeld" leftSection={<TbMusicSearch />} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/field" element={<VoiceField socket={socket} />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

