import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { v4 as uuid } from 'uuid';

export default observer(function AcitivityForm() {

    const { activityStore } = useStore();

    const { createActivity, loading, updateActivity, loadActivity, loadingInitial } = activityStore;

    const { id } = useParams();

    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: null,
        description: '',
        category: '',
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity title is required'),
        category: Yup.string().required('The category is required'),
        date: Yup.string().required('The date is required').nullable(),
        venue: Yup.string().required('The venue title is required'),
        city: Yup.string().required('The city title is required')
    })

    useEffect(() => {
        console.log(id);
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity]);

    function handleFormSubmit(activity: Activity) {
        if (!activity.id) {
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        } else {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content="Loading..." />

    return (
        <Segment clearing>
            <Header content='Activity details' sub color="orange" />
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={values => handleFormSubmit(values)}>
                {

                    ({ handleSubmit, isValid, isSubmitting, dirty }) =>

                        <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                            <MyTextInput name="title" placeholder="Title" />
                            <MyTextArea rows={3} placeholder='Description' name='description' />
                            <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                            <MyDateInput
                                placeholderText='Date'
                                name="date"
                                showTimeSelect
                                timeCaption="time"
                                dateFormat={'MMMM d, yyyy h:mm aa'}
                            />
                            <Header content='Location details' sub color="teal" />
                            <MyTextInput placeholder='City' name='city' />
                            <MyTextInput placeholder='Venue' name='venue' />
                            <Button
                                disabled={isSubmitting || !dirty || !isValid}
                                loading={loading} floated='right' positive type='submit' content='Submit' />
                            <Button as={Link} to='/activities' floated='right' type='button' color="grey" content='Cancel' />
                        </Form>

                }
            </Formik>

        </Segment>
    )
})