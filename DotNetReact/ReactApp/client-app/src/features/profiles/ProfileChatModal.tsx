import { observer } from 'mobx-react-lite';
import { useEffect, useState, useRef } from 'react';
import { Button, Form, Header, Icon, Label, Segment, Loader } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

export default observer(function ProfileChatModal({ profile }: Props) {
    const { privateChatStore, userStore } = useStore();
    const [draft, setDraft] = useState('');
    const [connectionError, setConnectionError] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        console.log('Modal opened, loading state:', privateChatStore.loading);
        setConnectionError(false);
        privateChatStore.createHubConnection(profile.userName);
        console.log('After createHubConnection, loading state:', privateChatStore.loading);

        return () => {
            privateChatStore.clearMessages();
        };
    }, [privateChatStore, profile.userName]);

    useEffect(() => {
        if (!privateChatStore.loading && privateChatStore.messages.length > 0) {
            setTimeout(() => scrollToBottom(), 0);
        }
        // Check if we have a loading timeout (connection might have failed)
        if (privateChatStore.loading && privateChatStore.messages.length === 0) {
            const timer = setTimeout(() => {
                if (privateChatStore.loading) {
                    console.log('Connection timeout - marking as error');
                    setConnectionError(true);
                }
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [privateChatStore.messages, privateChatStore.loading]);

    const handleSend = async () => {
        const trimmed = draft.trim();

        if (!trimmed) return;

        await privateChatStore.sendMessage(profile.userName, trimmed);
        setDraft('');
    };

    return (
        <div>
            <Header as='h3' dividing>
                <Icon name='chat' />
                <Header.Content>
                    Chat with {profile.displayName}
                    <Header.Subheader>{profile.userName}</Header.Subheader>
                </Header.Content>
            </Header>

            <Segment basic ref={messagesContainerRef} style={{ maxHeight: '320px', overflowY: 'auto', padding: '10px', position: 'relative', minHeight: '320px' }}>
                {privateChatStore.loading && !connectionError && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.9)', zIndex: 10 }}>
                        <Loader active />
                    </div>
                )}
                {connectionError && (
                    <div style={{ textAlign: 'center', color: '#d32f2f', padding: '20px' }}>
                        <p>Failed to connect. Please try again.</p>
                    </div>
                )}
                {privateChatStore.messages.length === 0 && !privateChatStore.loading && !connectionError && (
                    <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No messages yet</div>
                )}
                {privateChatStore.messages.map(message => {
                    const isMine = message.senderUserName === userStore.user?.userName;
                    return (
                        <div
                            key={message.id}
                            style={{
                                display: 'flex',
                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                                marginBottom: '0.75rem'
                            }}
                        >
                            <Label
                                color={isMine ? 'blue' : 'grey'}
                                basic={!isMine}
                                pointing
                                style={{ whiteSpace: 'pre-wrap', maxWidth: '80%' }}
                            >
                                {message.content}
                            </Label>
                        </div>
                    );
                })}
            </Segment>

            <Form onSubmit={event => {
                event.preventDefault();
                handleSend();
            }}>
                <input
                    value={draft}
                    onChange={event => setDraft(event.target.value)}
                    placeholder={`Message ${profile.displayName}...`}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d0d0d0',
                        marginBottom: '0.75rem'
                    }}
                />
                <Button primary fluid disabled={!draft.trim() || privateChatStore.loading || connectionError} type='submit'>
                    Send
                </Button>
            </Form>
        </div>
    );
});
