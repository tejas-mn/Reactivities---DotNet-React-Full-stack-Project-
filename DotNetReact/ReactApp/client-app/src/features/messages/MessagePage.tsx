import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Button, Header, Item, Loader, Segment, Label } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileChatModal from '../profiles/ProfileChatModal';

export default observer(function MessagePage() {
    const { modalStore, messageStore, profileStore, privateChatStore } = useStore();

    useEffect(() => {
        messageStore.loadConversations();
        modalStore.closeModal();
    }, [messageStore, modalStore]);

    const openChat = (partnerUserName: string) => {
        // Open modal immediately with minimal profile
        const minimalProfile = {
            userName: partnerUserName,
            displayName: partnerUserName,
            bio: '',
            image: '',
            followersCount: 0,
            followingCount: 0,
            following: false,
            photos: []
        };
        
        privateChatStore.markUserMessagesRead(partnerUserName);
        modalStore.openModal(<ProfileChatModal profile={minimalProfile} />);
        
        // Load full profile in background
        profileStore.loadProfile(partnerUserName).catch(err => {
            console.error('Failed to load profile:', err);
        });
    };

    return (
        <Segment>
            <Header as='h2'>Messages</Header>
            {messageStore.loading ? (
                <Loader active inline='centered' />
            ) : (
                <Item.Group divided>
                    {messageStore.conversations.map(conversation => (
                        <Item key={conversation.partnerUserName}>
                            <Item.Image avatar src='https://cdn-icons-png.flaticon.com/512/219/219983.png' />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header>
                                    {conversation.partnerUserName}
                                    {privateChatStore.unreadByUser.get(conversation.partnerUserName) && (
                                        <Label circular color='red' size='mini' style={{ marginLeft: '8px' }}>
                                            {privateChatStore.unreadByUser.get(conversation.partnerUserName)}
                                        </Label>
                                    )}
                                </Item.Header>
                                <Item.Meta>{conversation.lastUpdated}</Item.Meta>
                                <Item.Description>{conversation.lastMessage}</Item.Description>
                            </Item.Content>
                            <Item.Extra>
                                <Button
                                    floated='right'
                                    content='Open Chat'
                                    onClick={() => openChat(conversation.partnerUserName)}
                                />
                            </Item.Extra>
                        </Item>
                    ))}
                </Item.Group>
            )}
        </Segment>
    );
});
