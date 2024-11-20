import { Button, Item, Label, Segment } from "semantic-ui-react"
import { Activity } from "../../../app/models/activity"
import { SyntheticEvent, useState } from "react"

interface Props {
    activities: Activity[],
    handleSelectActivity: (id: string) => void,
    handleDeleteActivity: (id: string) => void,
    submitting: boolean
}

export default function ActivityList({ activities, handleSelectActivity, handleDeleteActivity, submitting }: Props) {

    const [target, setTarget] = useState('');

    function handleDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        handleDeleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {
                    activities.map(activity =>
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button 
                                        floated="right" content='View' 
                                        color="blue" onClick={() => handleSelectActivity(activity.id)} 
                                    />
                                    <Button
                                        name={activity.id}
                                        loading={target == activity.id && submitting}
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
}