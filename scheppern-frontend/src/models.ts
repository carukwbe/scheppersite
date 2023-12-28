import { Timestamp } from "firebase/firestore";

export interface Ticket {
    id?: string;
    order_id?: string;

    name: string;
    surname: string;
    email: string;
    phone?: string;

    status?: "ordered" | "payed" | "pending";
    modified_at?: Date;
    price?: number;
    carpass: boolean;
    helper: boolean;
    helper_job_preference?: string; //todo: umbenennen
    helper_time_preference?: string; //todo: umbenennen

    ticket_sent?: boolean;
    old_ticketID?: string;
}


export interface TicketLevel {
    name: string;
    regular_price: number;
    regular_with_carpass: number;
    helper_price: number;
    helper_with_carpass: number;
    activation_date: Timestamp;
    activation_date_string?: string;
    active: boolean;
}