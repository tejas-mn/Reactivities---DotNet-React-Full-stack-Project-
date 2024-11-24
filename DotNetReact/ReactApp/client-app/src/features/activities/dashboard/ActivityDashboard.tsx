import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import AcitivityForm from "../form/ActivityForm";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function ActivityDashboard() {

    const { activityStore } = useStore();

    return (
        <Grid>
            {/* take 10 columns instead of 16(for semantic ui) for boostrap its 12 column */}
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                {
                    activityStore.selectedActivity && !activityStore.editMode &&
                    <ActivityDetails />
                }
                {
                    activityStore.editMode &&
                    <AcitivityForm />
                }
            </Grid.Column>
        </Grid>

    )
});