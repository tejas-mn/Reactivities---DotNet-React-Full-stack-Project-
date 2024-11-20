import { Grid } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import AcitivityForm from "../form/ActivityForm";

interface Props {
    activities: Activity[],
    handleSelectActivity: (id: string) => void,
    handleCancelActivity: () => void,
    selectedActivity: Activity | undefined,
    editMode: boolean,
    handleFormOpen: (id: string) => void,
    handleFormClose: () => void,
    handleCreateEditActivity : (activity : Activity) => void,
    handleDeleteActivity : (id:string) => void
}

export default function ActivityDashboard({
    activities, selectedActivity, handleSelectActivity, handleCancelActivity, editMode, handleFormClose, handleFormOpen, handleCreateEditActivity, handleDeleteActivity }: Props) {

    return (
        <Grid>
            {/* take 10 columns instead of 16(for semantic ui) for boostrap its 12 column */}
            <Grid.Column width='10'>
                <ActivityList
                    activities={activities}
                    handleSelectActivity={handleSelectActivity}
                    handleDeleteActivity={handleDeleteActivity}
                />
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        handleCancelActivity={handleCancelActivity}
                        handleFormOpen={handleFormOpen}
                    />}
                {
                    editMode &&
                    <AcitivityForm
                        handleFormClose={handleFormClose}
                        selectedActivity={selectedActivity}
                        handleCreateEditActivity={handleCreateEditActivity}
                    />
                }
            </Grid.Column>
        </Grid>

    )
}