import { Button, Form, Segment } from "semantic-ui-react";

import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from 'uuid';
import { Link } from "react-router-dom";

export default observer(function AcitivityForm() {

    const { activityStore } = useStore();

    const { selectedActivity, createActivity, loading, updateActivity,loadActivity,loadingInitial } = activityStore;

    const {id} = useParams();

    const navigate = useNavigate();

    const [activity,setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    useEffect(()=>{
        console.log(id);
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);

    function handleSubmit() {
        if (!activity.id){
            activity.id = uuid();
            createActivity(activity).then( () => navigate(`/activities/${activity.id}`));
        }else{
            updateActivity(activity).then( () => navigate(`/activities/${activity.id}`))
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    }

    if(loadingInitial) return <LoadingComponent content="Loading..."/>

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input placeholder='Date' type="date" value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />
                <Button loading={loading} floated='right' positive type='submit' content='Submit' onClick={handleSubmit} />
                <Button as={Link} to ='/activities' floated='right' type='button' color="grey" content='Cancel'  />
            </Form>
        </Segment>
    )
})