import {useAccount} from "wagmi"
import {
    Button,
    Checkbox,
    Container,
    Input, List,
    Skeleton, Stack,
    Tabs,
    Text,
    Textarea,
    TextInput,
    Title,
    Tooltip
} from "@mantine/core"
import {useState} from "react"
import {IconCheck} from "@tabler/icons"
import {useForm, zodResolver} from "@mantine/form"
import {ImageInput} from "../ImageInput"
import {IconAlertCircle, IconBrandGithub, IconBrandTwitter, IconWorldWww} from "@tabler/icons"
import {showNotification} from '@mantine/notifications'
import {useListState} from "@mantine/hooks";
import {schema} from "../CreateOrganisation/schema";
import {NameInput} from "../NameInput";
import {AddressInput} from "../AddressInput";
import {MemberList} from "../MemberList";

export function EditOrganisation() {
    const {address} = useAccount()
    const [activeTab, setActiveTab] = useState("first")
    const [loading, setLoading] = useState(false)
    // TODO: Set user data as initial values
    const [active, setActive] = useState(0)
    const [image, setImage] = useState<File>()
    const [members, membersHandlers] = useListState<string>([]);

    const removeMember = (member: string) => {
        membersHandlers.filter(
            (other: string) => other.toLowerCase() !== member.toLowerCase()
        );
    };

    const addMember = (member: string) => {
        removeMember(member);
        membersHandlers.append(member);
    };

    const form = useForm({
        validate: zodResolver(schema),
        validateInputOnChange: true,
        initialValues: {
            accountName: '',
            displayName: '',
            website: '',
            description: '',
        },
    })

    return (
        <>
            <button onClick={() => setLoading((prevState) => !prevState)}>Toggle Skeleton</button>
            <Tabs value={activeTab} onTabChange={setActiveTab}>
                <Tabs.List grow>
                    <Tabs.Tab value="first">Basic Info</Tabs.Tab>
                    <Tabs.Tab value="second">Members</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel p={"xs"} value="first">
                    <Title my={"xs"} order={4}>Organisation Image</Title>
                    <Skeleton visible={loading}>
                        <ImageInput width={600} height={300} onChange={setImage} value={image}/>
                    </Skeleton>
                    <Title my={"xs"} order={4}>Account Name</Title>
                    <Skeleton visible={loading}>
                        <NameInput
                            parentId={80001}
                            required
                            disabled={true}
                            placeholder="Unique Account Name"
                            {...form.getInputProps("accountName")}
                        />
                    </Skeleton>
                    <Title my={"xs"} order={4}>Website</Title>
                    <Skeleton visible={loading}>
                        <Input
                            icon={<IconWorldWww size={16}/>}
                            placeholder="Your Website"
                            {...form.getInputProps('website')}
                            rightSection={
                                <Tooltip label="This is public" position="top-end" withArrow>
                                    <div>
                                        <IconAlertCircle size={18} style={{display: 'block', opacity: 0.5}}/>
                                    </div>
                                </Tooltip>
                            }
                        />
                    </Skeleton>
                    <Title my={"xs"} order={4}>Description</Title>
                    <Skeleton visible={loading}>
                        <TextInput placeholder="Description of your project" {...form.getInputProps('description')} />
                    </Skeleton>
                </Tabs.Panel>
                <Tabs.Panel p={"xs"} value="second">
                    <Stack style={{maxWidth: 784}}>
                        <Title mt="lg">Members</Title>
                        <Text color={"dimmed"}>
                            Members can perform the following actions:
                        </Text>
                        <List>
                            <List.Item>Update account info</List.Item>
                            <List.Item>Add or remove account members</List.Item>
                            <List.Item>Create new projects</List.Item>
                            <List.Item>Add or remove project members</List.Item>
                            <List.Item>Update project info</List.Item>
                            <List.Item>Publish new releases</List.Item>
                        </List>
                        <Title order={2}>Account Admins</Title>
                        <AddressInput onSubmit={addMember}/>
                        <Skeleton visible={loading}>
                            <MemberList
                                label="Account Admin"
                                members={members}
                                editable={true}
                                onRemove={removeMember}
                            />
                        </Skeleton>
                    </Stack>
                </Tabs.Panel>
            </Tabs>
            <Button m={"sm"} onClick={() => {
                showNotification({title: "Success", message: "Profile updated successfully.", icon: <IconCheck/>})
            }}>
                Save Changes
            </Button>
        </>
    )
}