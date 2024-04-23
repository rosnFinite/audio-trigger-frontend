import React, { useEffect, useState } from "react";
import "./Layout.css";
import "@mantine/core/styles.css";
import {
  AppShell,
  Badge,
  Burger,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  NavLink,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  TbAlpha,
  TbChartGridDots,
  TbMusicSearch,
  TbSettings,
  TbNotes,
} from "react-icons/tb";
import { useAppSelector } from "../../redux/hooks";
import { useLocation } from "react-router-dom";

export default function Layout(props: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [opened, { toggle }] = useDisclosure();
  const [trigBadgeColor, setTrigBadgeColor] = useState("red");
  const [loadingVisible, setLoadingVisible] = useState(false);
  const status = useAppSelector((state) => state.settings.values.status);
  const audioClientSID = useAppSelector((state) => state.settings.values.sid);

  useEffect(() => {
    console.log("Status: ", status);
    switch (status) {
      case "running":
        setTrigBadgeColor("lime");
        break;
      case "ready":
      case "reset":
        setTrigBadgeColor("yellow");
        break;
      default:
        setTrigBadgeColor("red");
    }
  }, [status]);

  useEffect(() => {
    // Show loading overlay if no audio client is connected
    setLoadingVisible(audioClientSID === "" ? true : false);
  }, [audioClientSID]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 180, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Flex justify="flex-start" align="center">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Container w={70} ml={-5} mr={-10} mt={10}>
            <TbChartGridDots size={"100%"} color="#1C7ED6" />
          </Container>
          <Text fw={500} size="xl" visibleFrom="sm">
            Laryngeal Voice Range Field (LVRF)
          </Text>
          <Badge
            rightSection={<TbAlpha />}
            size="sm"
            variant="gradient"
            gradient={{ from: "blue", to: "green", deg: 90 }}
            ml={10}
            mt={5}
            visibleFrom="sm"
          >
            Alpha
          </Badge>
          <Group justify="flex-end" gap="xs" ml={"auto"} mr={"2%"}>
            <Text size="xs" visibleFrom="sm">
              ClientID:&nbsp;&nbsp;
              {audioClientSID === "" ? (
                <Text span c="red" inherit>
                  Nicht verbunden
                </Text>
              ) : (
                <Text span c="blue" inherit>
                  {audioClientSID}
                </Text>
              )}
            </Text>
            <Tooltip
              label={`Triggerprozess ist ${
                status === "running"
                  ? "aktiv"
                  : status === "ready" || status === "reset"
                  ? "bereit"
                  : "inaktiv"
              }`}
              color={trigBadgeColor}
            >
              <Badge size="md" variant="filled" color={trigBadgeColor}>
                Trigger
              </Badge>
            </Tooltip>
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <NavLink
          href="/"
          label="Einstellungen"
          leftSection={<TbSettings />}
          active={pathname === "/"}
        />
        <NavLink
          href="/dashboard"
          label="Dashboard"
          leftSection={<TbMusicSearch />}
          active={pathname === "/dashboard"}
        />
        <NavLink
          href="/logs"
          label="Logs"
          leftSection={<TbNotes />}
          active={pathname === "/logs"}
        />
      </AppShell.Navbar>
      <AppShell.Main pos="relative">
        {process.env.NODE_ENV === "development" ? (
          <></>
        ) : (
          <LoadingOverlay
            visible={loadingVisible}
            loaderProps={{
              children:
                "Kein Audioclient verbunden. Bitte stelle eine Verbindung her...",
            }}
          />
        )}
        {props.children}
      </AppShell.Main>
    </AppShell>
  );
}
