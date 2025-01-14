import Head from "next/head";
import {Button, Container, Group, Title} from "@mantine/core";
import Link from "next/link";
import {Layout} from "../components/Layout";
import {ProjectData} from "../components/ProjectData";
import {useRouter} from "next/router"
import {fetchProjectDetails} from "../constants/graphql/queries"
import {graphql} from "@valist/sdk"
import {useEffect, useState} from "react";

export default function Project() {
    const router = useRouter()
    const orgName = router.query.orgName
    const [data, setData] = useState(null)
    const [name, setName] = useState("project")
    useEffect(() => {
        const projectId = router.query.accHex
        const query = {
            query: fetchProjectDetails,
            variables: {
                projId: projectId
            }
        }
        graphql.fetchGraphQL("https://api.thegraph.com/subgraphs/name/valist-io/valistmumbai", query).then(res => {
            console.log("res", res)
            setName(res.data.project.name)
            setData(res.data.project)
        })
    }, [])

    return (
        <Layout>
            <Head>
                <title>Project - m3tadao</title>
            </Head>
            <Group position={"apart"} p={"xl"} mx={"xl"} my={"sm"}>
                <Title>
                    Welcome to {name} 👋
                </Title>
                <Button.Group>
                    <Link href={`https://app.valist.io/-/account/${orgName}/project/${name}/create/release`} passHref>
                        <Button
                            component={"a"}
                            target={"_blank"}
                            radius="md"
                            mt="xl"
                            size="md"
                            variant={"light"}
                            // color={theme.colorScheme === 'dark' ? undefined : 'dark'}
                        >
                            New Release
                        </Button>
                    </Link>
                    <Link href={"#"} passHref>
                        <Button
                            component={"a"}
                            radius="md"
                            mt="xl"
                            size="md"
                            variant={"light"}
                            // color={theme.colorScheme === 'dark' ? undefined : 'dark'}
                        >
                            Purchase
                        </Button>
                    </Link>
                </Button.Group>
            </Group>
            <Container>
                <ProjectData data={data}/>
            </Container>
        </Layout>
    )
}