import { Button, Container, Menu } from "semantic-ui-react";

interface Props {
    handleFormOpen : (id: string) => void
}

export default function NavBar({handleFormOpen} : Props){
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item>
                    <img src="" alt="Logo" style={{marginRight : '10px'}}/>
                    DotNetReact
                </Menu.Item>
                <Menu.Item name="Activities"/>
                <Menu.Item>
                    <Button positive content='Create Activity' onClick={()=> handleFormOpen('')}/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}