import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import { store, useStore } from '../../app/stores/store';
import agent from '../../app/api/agent';
import { runInAction } from 'mobx';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default observer(function ContinueForm() {
    const { userStore } = useStore();

    // Use a `ref` instead of let/useSate to hold the timeout ID so it persists across re-renders
    const timeoutIdRef = useRef<number | null>(null);
    const intervalIdRef = useRef<number | null>(null);

    const [count, setCounter] = useState(30);

    useEffect(() => {

        // Start the timeout when the component mounts
        timeoutIdRef.current = window.setTimeout(() => {
            toast.error('Session Expired - Please log in again', {
                position: 'top-center'
            });
            handleNo();
        }, 30000);

        // Start the interval when the component mounts
        intervalIdRef.current = setInterval(() => {
            setCounter((prev) => prev - 1); //when this state changes and component re renders still the refs will be persisted
        }, 1000);

        // Clear the timeout & interval when the component unmounts 
        // (i.e when user clicks outside of the modal so that after clicking outside it wont refresh Token nor logout)
        return () => {
            if (timeoutIdRef.current !== null) {
                clearTimeout(timeoutIdRef.current);
            }
            if (intervalIdRef.current !== null) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, []);

    const handleYes = async () => {

        // Clear the existing timeout and interval
        if (timeoutIdRef.current !== null) {
            clearTimeout(timeoutIdRef.current);
        }

        if (intervalIdRef.current !== null) {
            clearInterval(intervalIdRef.current);
        }

        try {
            const user = await agent.Account.refreshToken();
            runInAction(() => (userStore.user = user));
            store.commonStore.setToken(user.token);
            userStore.startRefreshTokenTimer(user);
            store.modalStore.closeModal();
        } catch (error) {
            console.log(error);
        }
    };

    const handleNo = () => {
        store.modalStore.closeModal();
        userStore.logout();
    };

    return (
        <div>
            <p>Your session is about to expire ({count}s) . Do you wish to continue?</p>
            <Button content="Yes" color="green" onClick={handleYes} />
            <Button content="No" color="red" onClick={handleNo} />
        </div>
    );
});