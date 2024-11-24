import {
    CardMeta,
    CardHeader,
    CardDescription,
    CardContent,
    Card,
    Image,
    Button,
} from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'
import LoadingComponent from '../../../app/layout/LoadingComponent';

export default function ActivityDetails() {
    
    const {activityStore} = useStore();
    const {selectedActivity:activity, openForm, cancelSelectedActivity} = activityStore;

    if(!activity) return <LoadingComponent/>;

    return (
        <Card fluid>
            <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
            <CardContent>
                <CardHeader>{activity.title}</CardHeader>
                <CardMeta>
                    <span className='date'>{activity.date}</span>
                </CardMeta>
                <CardDescription>
                    {activity.description}
                </CardDescription>
            </CardContent>
            <CardContent extra>
                <Button.Group widths={2}>
                    <Button basic color='blue' content='Edit' onClick={() => openForm(activity.id)} />
                    <Button basic color='grey' content='Cancel' onClick={cancelSelectedActivity} />
                </Button.Group>
            </CardContent>
        </Card>
    )
}