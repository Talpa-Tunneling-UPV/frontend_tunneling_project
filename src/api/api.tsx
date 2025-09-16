import axios from "axios";

export async function getMethod<T>(url: string): Promise<T> {
    const result = (await axios.get<T>(url)).data;
    return result;
}

interface MetricCard {
    title: string;
    value: number;
    measure: string;
    maxValue: number;
}

const apiBase = (import.meta.env as any).VITE_BACKEND_URL;

const api = {
    getMetrics: () => getMethod<MetricCard[]>(`${apiBase}/api/metrics/`),
}

type apiMethods = {
    [key in keyof typeof api]: keyof typeof api;
}

const apiMethods: apiMethods = {
    getMetrics: "getMetrics",
}

export const apiUtils = {
    api: api,
    apiMethods: apiMethods,
}