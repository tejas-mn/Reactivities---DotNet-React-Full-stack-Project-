import { act, useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState([]);
  
  useEffect(()=>{
    axios.get('https://super-duper-xylophone-jw7qvvx99gc967-5035.app.github.dev/api/activities/')
      .then( res => {
        setActivities(res.data);
      })
  }, [])
  return (
    
    <>
     <Header as='h2' icon='users' content='DotNetReact ' />
     <List>
      {
        activities.map((a : any) =>  <List.Item key={a.id}>{a.title}</List.Item>)
      }
     </List>
    </>
  )
}

export default App