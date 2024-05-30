import { IconHome } from "@tabler/icons-react";
import {Center, Drawer, rem, Text, ThemeIcon, UnstyledButton} from "@mantine/core";
import classes from "@/components/MobileNavbar/MobileNavbar.module.css";
import {useDisclosure} from "@mantine/hooks";

export default function MobileNavbarNavigation() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Drawer
                position="bottom"
                size="60vh"
                opened={opened}
                onClose={close}
                classNames={{
                    content: classes.drawer,
                    header: classes.drawer
                }}
                zIndex={29999}
            >
                MobileModalMenu
            </Drawer>
            <Center flex={1}>
                <UnstyledButton onClick={open} className={classes.buttonWrapper}>
                    <ThemeIcon className={classes.button}>
                        <IconHome className={classes.icon} stroke={1.5} size={rem(28)} />
                    </ThemeIcon>
                    <Text className={classes.text}>Навигация</Text>
                </UnstyledButton>
            </Center>
        </>
    );
}