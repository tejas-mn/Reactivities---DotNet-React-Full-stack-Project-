import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Button, Form, Header, Icon, Label, Segment } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile;
}

export default observer(function ProfileChatModal({ profile }: Props) {
    const { privateChatStore, userStore } = useStore();
    const [draft, setDraft] = useState('');

    useEffect(() => {
        privateChatStore.createHubConnection(profile.userName);

        return () => {
            privateChatStore.clearMessages();
        };
    }, [privateChatStore, profile.userName]);

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

            <Segment basic style={{ maxHeight: '320px', overflowY: 'auto', padding: 0 }}>
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
                <Button primary fluid disabled={!draft.trim()} type='submit'>
                    Send
                </Button>
            </Form>
        </div>
    );
});
