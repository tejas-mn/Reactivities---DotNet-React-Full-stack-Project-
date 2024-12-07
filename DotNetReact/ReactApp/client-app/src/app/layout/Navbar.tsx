import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { NavLink } from "react-router-dom";

export default function NavBar() {
    const { activityStore } = useStore();

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item as={NavLink} to='/' header>
                    <img src="https://png.pngtree.com/png-vector/20240824/ourlarge/pngtree-the-logo-of-nature-with-its-background-png-image_13604277.png" alt="Logo" style={{ marginRight: '10px' }} />
                    DotNetReact
                </Menu.Item>
                <Menu.Item  as = {NavLink} to = '/activities' name="Activities" />
                <Menu.Item  as = {NavLink} to = '/errors' name="Errors" />
                <Menu.Item>
                    <Button as ={NavLink} to='/createActivity' positive content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}