import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";
import { router } from "../router/Routes";
import React from "react";
import ContinueForm from "../../features/users/ContinueForm";
import { toast } from "react-toastify";

export default class UserStore {
    user: User | null = null;
    fbAccessToken: string | null = null;
    fbLoading = false;
    refreshTokenTimeout: any;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => this.user = user);
            router.navigate('/activities');
            store.modalStore.closeModal();
            toast.success('Sucessfully Logged In!', {
                position: 'top-center',
                hideProgressBar: false
            });
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        router.navigate('/');
        toast.info('Sucessfully Logged Out!', {
            position: 'top-center',
            bodyStyle: {
                'width': '3000px !important',
                'height': '20px !important'
            }
        });
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            await agent.Account.register(creds);
            router.navigate(`/account/registerSuccess?email=${creds.email}`);
            store.modalStore.closeModal();
            toast.success('Sucessfully Registered!', {
                position: 'top-center',
            });
        } catch (error) {
            throw error;
        }
    }

    setImage = (image: string) => {
        if (this.user)
            this.user.image = image;
    }

    setDisplayname = async (displayName: string) => {
        if (this.user)
            this.user.displayName = displayName;
    }

    getFacebookLoginStatus = async () => {

    }

    facebookLogin = () => {

    }

    refreshToken = async () => {

        if (!this.isLoggedIn) {
            this.stopRefreshTokenTimer();
            toast.info('Not Logged in')
            return; //stop continious refresh if user is not logged in 
        };

        //stop and start new timer everytime its about to refresh
        this.stopRefreshTokenTimer();

        store.modalStore.openModal(React.createElement(ContinueForm));
    }

    public startRefreshTokenTimer(user: User) {

        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));

        const expires = new Date(jwtToken.exp * 1000);

        const timeout = expires.getTime() - Date.now() - (60 * 1000);

        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

}