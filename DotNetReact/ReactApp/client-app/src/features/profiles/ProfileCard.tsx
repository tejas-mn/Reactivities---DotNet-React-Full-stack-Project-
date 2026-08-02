import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';
import FollowButton from './FollowButton';
import ProfileChatModal from './ProfileChatModal';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
    const { modalStore } = useStore();

    return (
        <Card as={Link} to={`/profiles/${profile.userName}`}>
            <Image src={profile.image || 'https://cdn-icons-png.flaticon.com/512/219/219983.png'} />
            <Card.Content>
                <Card.Header>
                    {profile.displayName}
                </Card.Header>
                <Card.Description>
                    {profile.bio && profile.bio?.length > 40 ? profile.bio?.slice(0, 37) + '...' : profile.bio}
                </Card.Description>
                <Card.Description>
                    <Icon name='user' />
                    {profile.followersCount} followers
                </Card.Description>
            </Card.Content>
            <FollowButton profile={profile} />
            <Button
                fluid
                content='Message'
                onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();
                    modalStore.openModal(<ProfileChatModal profile={profile} />);
                }}
            />
        </Card>
    )
})