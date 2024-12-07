import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment, Image, Button, Divider } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
// import LoginForm from '../users/LoginForm';
// import RegisterForm from '../users/RegisterForm';

export default observer(function HomePage(){
    // const {userStore, modalStore} = useStore();
    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='https://png.pngtree.com/png-vector/20240824/ourlarge/pngtree-the-logo-of-nature-with-its-background-png-image_13604277.png' alt='logo' style={{marginBottom: 12}} />
                    Reactivities
                </Header>
                <Header as='h2' inverted content='Welcome to Reactivities' />
                        <Button as={Link} to='/activities' size='huge' inverted >
                            Go to Activities!
                        </Button>
                {/* {userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' inverted content='Welcome to Reactivities' />
                        <Button as={Link} to='/activities' size='huge' inverted >
                            Go to Activities!
                        </Button>
                            </>
                ) : (
                        <>
                            <Button onClick={() => modalStore.openModal(<LoginForm />) } size='huge' inverted >
                                Login!
                            </Button>
                            <Button onClick={() => modalStore.openModal(<RegisterForm />) } size='huge' inverted >
                                Register!
                            </Button>
                            <Divider horizontal inverted>Or</Divider>
                            <Button
                                size='huge'
                                inverted
                                color='facebook'
                                content='Login with Facebook'
                                onClick={userStore.facebookLogin}
                            />
                       </>
                )}
                 */}
                
            </Container>
        </Segment>
    )
})