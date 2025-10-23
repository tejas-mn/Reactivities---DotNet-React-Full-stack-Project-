import { observer } from 'mobx-react-lite';
import Calendar from 'react-calendar';
import { Button, Divider, Dropdown, Header, Input, Menu } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import DatePicker from 'react-datepicker';
import MyDateInput from '../../../app/common/form/MyDateInput';

export default observer(function ActivityFilters() {
    const { activityStore: { predicate, setPredicate } } = useStore();

    const locationOptions = [
        { key: 'ny', text: 'New York', value: 'New York' },
        { key: 'la', text: 'Los Angeles', value: 'Los Angeles' },
        { key: 'chi', text: 'Chicago', value: 'Chicago' },
        { key: 'hou', text: 'Houston', value: 'Houston' }
    ];

    const hostOptions = [
        { key: 'alice', text: 'Alice', value: 'Alice' },
        { key: 'bob', text: 'Bob', value: 'Bob' },
        { key: 'charlie', text: 'Charlie', value: 'Charlie' },
        { key: 'david', text: 'David', value: 'David' }
    ];

    return (
        <>

            {/* Search */}
            <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
                <Header icon='search' attached color='teal' content='Search' />
                <Menu.Item>
                    {/* Search box with button to search using title */}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', }}>
                        <Input
                            style={{ width: '100%' }}
                            placeholder='Search...'
                        />
                        <Button icon='search' />
                    </div>
                </Menu.Item>
            </Menu>

            <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item
                    content='All Activities'
                    active={predicate.has('all')}
                    onClick={() => setPredicate('all', 'true')}
                />
                <Menu.Item
                    content="I'm going"
                    active={predicate.has('isGoing')}
                    onClick={() => setPredicate('isGoing', 'true')}
                />
                <Menu.Item
                    content="I'm hosting"
                    active={predicate.has('isHost')}
                    onClick={() => setPredicate('isHost', 'true')}
                />
            </Menu>
      

            {/* put in inside with label */}

            <Header icon='map marker alternate' attached color='teal' content='Filter by Location' />
            <Dropdown placeholder='Select Location' fluid multiple selection options={locationOptions} />


            {/* Filter by host dropdown */}
            <Header icon='user' attached color='teal' content='Filter by Host' />
            <Dropdown placeholder='Select Host' fluid multiple selection options={hostOptions} />

            {/* Filter by start and end date times */}


            {/* use date picker or field from semantic ui */}

            {/* Style them */}
            {/* <label>Start Date</label>
            <DatePicker
                selected={predicate.get('startDate') || null}
                onChange={(date: Date) => setPredicate('startDate', date)}
                placeholderText='Start Date'
                className='form-control'
            />
            <label>End Date</label>
            <DatePicker
                selected={predicate.get('endDate') || null}
                onChange={(date: Date) => setPredicate('endDate', date)}
                placeholderText='End Date'
                className='form-control'
            /> */}

            <Divider />

            <Header icon='calendar' attached color='teal' content='Select Date' />
            <Calendar
                onChange={(date) => setPredicate('startDate', date as Date)}
                value={predicate.get('startDate') || new Date()}
            />
        </>
    )
})