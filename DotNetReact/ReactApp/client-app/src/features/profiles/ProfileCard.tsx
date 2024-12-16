import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {
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
        </Card>
    )
})