import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesbyDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) =>
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(this.activitiesbyDate.reduce((activities, activity) => {
            const date = format(activity.date!, 'dd MM yyyy');
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: Activity[] })
        );
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activites.list();
            runInAction(() => {
                activities.forEach(a => {
                    this.setActivity(a);
                });
            })
            this.setLoadingInitial(false);
        } catch (err) {
            console.log(err);
            this.setLoadingInitial(false);
        }
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activites.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                p => p.userName === user.userName
            )
            activity.isHost = activity.hostUserName === user.userName;
            activity.host = activity.attendees?.find(p => p.userName === activity.hostUserName);
        }

        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value;
    }

    // selectActivity = (id: string) => {
    //     this.selectedActivity = this.activityRegistry.get(id);
    // }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    // openForm = (id?: string) => {
    //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //     this.editMode = true;
    // }

    // closeForm = () => {
    //     this.editMode = false;
    // }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!); //current user as attendee
        try {
            await agent.Activites.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUserName = user!.userName; //current user is the host
            newActivity.attendees = [attendee]; //current user as attendee
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activites.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = { ...this.getActivity(activity.id), ...activity }
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activites.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (err) {
            console.log(err);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activites.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.isGoing = false; //if going toggle to false
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(p => p.userName !== user?.userName); //filter only going attendees
                } else {
                    this.selectedActivity!.isGoing = true; //if not attending toggle to true
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!); //update registry
            });
        }
        catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activites.attend(this.selectedActivity!.id); //if current logged in user and host of activity are same then it cancels activity
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!); //update registry
            })
        } catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach(attendee => {
                if(attendee.userName === username)
                {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
    }
}