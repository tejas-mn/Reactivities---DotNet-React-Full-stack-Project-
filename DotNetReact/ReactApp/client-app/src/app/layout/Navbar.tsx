import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    const { activityStore } = useStore();

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="" alt="Logo" style={{ marginRight: '10px' }} />
                    DotNetReact
                </Menu.Item>
                <Menu.Item  as = {NavLink} to = '/activities' name="Activities" />
                <Menu.Item>
                    <Button as ={NavLink} to='/createActivity' positive content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}