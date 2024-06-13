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
  Text,
  Tooltip,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TbAlpha, TbMusicSearch, TbSettings, TbNotes } from "react-icons/tb";
import { useAppSelector } from "../../redux/hooks";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Layout(props: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [opened, { toggle }] = useDisclosure();
  const [trigBadgeColor, setTrigBadgeColor] = useState("red");
  const [trigText, setTrigText] = useState("offline");
  const status = useAppSelector((state) => state.settings.values.status);
  const audioClientSID = useAppSelector((state) => state.settings.values.sid);

  useEffect(() => {
    switch (status) {
      case "running":
        setTrigText("aktiv");
        setTrigBadgeColor("lime");
        break;
      case "ready":
      case "reset":
        setTrigText("bereit");
        setTrigBadgeColor("yellow");
        break;
      case "waiting":
        setTrigText("wartet");
        setTrigBadgeColor("grey");
        break;
      default:
        setTrigText("offline");
        setTrigBadgeColor("red");
    }
  }, [status]);

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
            <Logo />
          </Container>
          <Text fw={500} size="xl" visibleFrom="sm">
            Laryngeal Voice Range Field (LVRF)
          </Text>
          <Badge
            size="sm"
            variant="gradient"
            gradient={{ from: "blue", to: "green", deg: 90 }}
            ml={10}
            mt={5}
            visibleFrom="sm"
          >
            0.9.5
          </Badge>
          <Group justify="flex-end" gap="xs" ml={"auto"} mr={"2%"}>
            <Text size="xs" visibleFrom="sm">
              BackendID:&nbsp;&nbsp;
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
                {trigText}
              </Badge>
            </Tooltip>
          </Group>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button
            radius="xs"
            justify="space-between"
            fullWidth
            rightSection={<TbSettings />}
            variant={pathname === "/" ? "light" : "transparent"}
          >
            Einstellungen
          </Button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <Button
            radius="xs"
            justify="space-between"
            fullWidth
            rightSection={<TbMusicSearch />}
            variant={pathname === "/dashboard" ? "light" : "transparent"}
          >
            Stimmfeld
          </Button>
        </Link>
        <Link to="/logs" style={{ textDecoration: "none" }}>
          <Button
            radius="xs"
            justify="space-between"
            fullWidth
            rightSection={<TbNotes />}
            variant={pathname === "/logs" ? "light" : "transparent"}
          >
            Logs
          </Button>
        </Link>
      </AppShell.Navbar>
      <AppShell.Main pos="relative">{props.children}</AppShell.Main>
    </AppShell>
  );
}
