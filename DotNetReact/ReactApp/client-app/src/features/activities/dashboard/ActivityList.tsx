import { Button, Item, Label, Segment } from "semantic-ui-react"
import { SyntheticEvent, useState } from "react"
import { useStore } from "../../../app/stores/store"
import { observer } from "mobx-react-lite"
import { Link } from "react-router-dom"


export default observer( function ActivityList() {

    const {activityStore} = useStore();

    const {deleteActivity, activitiesbyDate, loading} = activityStore;

    const [target, setTarget] = useState('');

    function handleDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {
                    activitiesbyDate.map(activity =>
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button as={Link} to ={`/activities/${activity.id}`} floated="right" content='View' color="blue"    />
                                    <Button
                                        name={activity.id}
                                        loading={target == activity.id && loading}
                                        floated="right" content='Delete' color="red"
                                        onClick={(e) => handleDelete(e, activity.id)}
                                    />
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    )
                }
            </Item.Group>
        </Segment>
    )
})