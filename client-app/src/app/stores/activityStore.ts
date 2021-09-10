import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity|undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    get ActivitiesByDate() {
        return Array
            .from(this.activityRegistry.values())
            .sort((a: Activity, b: Activity) =>
                Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                activity.date = activity.date.split('T')[0];
                this.activityRegistry.set(activity.id, activity);
              });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        if (id) {
            this.selectActivity(id);
        } else {
            this.cancelSelectActivity();
        }
        this.setEditMode(true);
    }

    closeForm = () => {
        this.setEditMode(false);
    }

    setEditMode = (value: boolean) => {
        this.editMode = value;
    }

    createActivity = async (activity: Activity) => {
        this.setLoading(true);
        activity.id = uuid();

        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.setEditMode(false);
                this.setLoading(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setLoading(true);

        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.setEditMode(false);
                this.setLoading(false);
            });
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }

    setLoading = (value: boolean) => {
        this.loading = value;
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true);

        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);

                if (this.selectedActivity?.id === id) {
                    this.cancelSelectActivity();
                }

                this.setLoading(false);
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.setLoading(false);
            });
        }
    }
}