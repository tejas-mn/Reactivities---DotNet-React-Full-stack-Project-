import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { Activity } from "../../../app/models/activity";
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {

    const { activityStore: { loading } } = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {/* {activity.isCancelled && 
                    <Label style={{position: 'absolute', zIndex:1000, left:-14,top:20}} 
                        ribbon color='red' content='Cancelled' />
                } */}
                <Image src='https://img.freepik.com/free-vector/cartoon-mountain-landscape-with-foothpath-pine-forest-vector-illustration-majestic-peaks-horizon-green-grass-tall-trees-stones-ground-summer-scenery-hiking-recreation-travel_107791-21196.jpg' fluid style={activityImageStyle} />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button loading={loading} color='teal'>  Join Activity </Button>
                <Button loading={loading} >  Cancel attendance</Button>
                <Button as={Link} to={`/manage/${activity.id}`} loading={loading} color='orange' floated='right'> Manage Event </Button>
            </Segment>
        </Segment.Group>
    )
})