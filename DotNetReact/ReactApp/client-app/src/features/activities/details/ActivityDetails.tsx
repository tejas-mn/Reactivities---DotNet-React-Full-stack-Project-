import {
    CardMeta,
    CardHeader,
    CardDescription,
    CardContent,
    Card,
    Image,
    Button,
} from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

interface Props {
    activity: Activity,
    handleCancelActivity: () => void,
    handleFormOpen : (id : string) => void
}

export default function ActivityDetails({ activity, handleCancelActivity , handleFormOpen}: Props) {
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
                    <Button basic color='blue' content='Edit' onClick={() => handleFormOpen(activity.id)} />
                    <Button basic color='grey' content='Cancel' onClick={handleCancelActivity} />
                </Button.Group>
            </CardContent>
        </Card>
    )
}