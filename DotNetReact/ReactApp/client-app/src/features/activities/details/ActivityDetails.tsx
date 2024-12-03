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
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

export default observer( function ActivityDetails() {
    
    const {activityStore} = useStore();
    const {selectedActivity:activity, loadActivity, loadingInitial} = activityStore;

    const {id} = useParams();
    
    useEffect(()=>{
        if(id) loadActivity(id);
    }, [id, loadActivity]);

    if(loadingInitial || !activity) return <LoadingComponent/>;

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
                    <Button as = {Link} to ={`/manage/${activity.id}`} basic color='blue' content='Edit' />
                    <Button as = {Link} to ={`/activities`} basic color='grey' content='Cancel'  />
                </Button.Group>
            </CardContent>
        </Card>
    )
})