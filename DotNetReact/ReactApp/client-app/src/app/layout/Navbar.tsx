import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";

export default function NavBar() {
    const { activityStore } = useStore();

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item>
                    <img src="" alt="Logo" style={{ marginRight: '10px' }} />
                    DotNetReact
                </Menu.Item>
                <Menu.Item name="Activities" />
                <Menu.Item>
                    <Button positive content='Create Activity' onClick={() => activityStore.openForm()} />
                </Menu.Item>
            </Container>
        </Menu>
    )
}