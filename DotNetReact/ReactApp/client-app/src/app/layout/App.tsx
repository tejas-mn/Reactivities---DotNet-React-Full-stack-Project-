import { useEffect, useState } from 'react'
import './styles.css'
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agent.Activites
      .list()
      .then(res => {
        let activities: Activity[] = [];
        res.forEach(a => {
          a.date = a.date.split('T')[0];
          activities.push(a);
        })
        setActivities(activities);
        setLoading(false);
      })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id: string) {
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateEditActivity(activity: Activity) {
    setSubmitting(true);
    if (activity.id) {
      agent.Activites.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !== activity.id), activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      })
    } else {
      activity.id = uuid();
      agent.Activites.create(activity).then(() => {
        setActivities([...activities, activity]);
        setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
      });
    }

  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activites.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)]);
      setSubmitting(false);
    })
  }

  if (loading) return <LoadingComponent content='Loading..' />;

  return (
    <>
      <NavBar handleFormOpen={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          handleSelectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          handleCancelActivity={handleCancelActivity}
          editMode={editMode}
          handleFormOpen={handleFormOpen}
          handleFormClose={handleFormClose}
          handleCreateEditActivity={handleCreateEditActivity}
          handleDeleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </>
  )
}

export default App