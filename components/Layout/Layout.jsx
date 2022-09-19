import {HeaderSimple} from "../HeaderSimple";
import {AppShell, Navbar, Header} from '@mantine/core';

export function Layout({children}) {
    return (
        <AppShell
            padding="md"
            header={<Header height={60} p="xs"><HeaderSimple/></Header>}
            styles={(theme) => ({
                main: {backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]},
            })}
        >
            {children}
        </AppShell>
    );
}