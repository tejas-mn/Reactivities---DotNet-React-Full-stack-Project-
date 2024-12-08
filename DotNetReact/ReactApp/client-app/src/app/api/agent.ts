import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'https://super-duper-xylophone-jw7qvvx99gc967-5035.app.github.dev/api/';

axios.interceptors.response.use(async res => {
    await sleep(1000);
    return res;
}, (err: AxiosError) => {
    const { data, status, config } = err.response as AxiosResponse;

    switch (status) {
        case 400:
            if (typeof data === 'string') {
                toast.error(data);
            }

            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }

            if (data.errors) {
                const modalstateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalstateErrors.push(data.errors[key]);
                    }
                }
                throw modalstateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 403:
            toast.error('forbidden');
            break;
        case 404:
            router.navigate('/not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }

    return Promise.reject(err);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Activites = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
    Activites
}

export default agent;