import React, { useEffect, useState } from 'react';
import './styles/App.css';
import '@mantine/core/styles.css';
import { Routes, Route } from 'react-router-dom';
import Settings from "./views/Settings";
import VoiceField from "./views/VoiceField";
import {socket} from "./socket";
import { AppShell, Badge, Burger, Container, Flex, Group, Indicator, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { TbAlpha, TbChartGridDots, TbMusicSearch, TbSettings } from 'react-icons/tb';
import { useAppSelector } from './redux/hooks';

export default function App() {
  const [opened, {toggle}] = useDisclosure();
  const [recBadgeColor, setRecBadgeColor] = useState("red");
  const [trigBadgeColor, setTrigBadgeColor] = useState("red");
  const status = useAppSelector((state) => state.settings.values.status)

  useEffect(() => {
    console.log("Status: ", status);
    switch (status.recorder) {
      case "online": 
        setRecBadgeColor("lime");
        break;
      case "ready":
        setRecBadgeColor("yellow");
        break;
      default:
        setRecBadgeColor("red");
    }

    switch (status.trigger) {
      case "online": 
        setTrigBadgeColor("lime");
        break;
      case "ready":
        setTrigBadgeColor("yellow");
        break;
      default:
        setTrigBadgeColor("red");
    }
  }, [status]);

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
          <Group justify='flex-end' gap="xs" ml={"auto"}>
            <Indicator position='middle-start' color={recBadgeColor} processing={recBadgeColor==="red" ? false : true}>
              <Badge
                size='xl'
                mr={30}
                variant='light'
                color={recBadgeColor}
              >
                REC
              </Badge>
            </Indicator>
            <Indicator position='middle-start' color={trigBadgeColor} processing={trigBadgeColor==="red" ? false : true}>
              <Badge 
                size="xl"
                mr={30}
                variant="light"
                color={trigBadgeColor}
              >
                TRIG
              </Badge>
            </Indicator>
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <NavLink href="/" label="Einstellung" leftSection={<TbSettings />}/>
        <NavLink href='/stimmfeld' label="Stimmfeld" leftSection={<TbMusicSearch />} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Settings />} />
          <Route path="/stimmfeld" element={<VoiceField socket={socket} />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

