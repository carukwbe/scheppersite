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
    helper_shifts?: string;
    helper_infos?: string;

    ticket_sent?: boolean;
    old_ticketID?: string;
}


export interface TicketLevel {
    name: string;

    regular_price: number;
    regular_with_carpass: number;
    helper_price: number;
    helper_with_carpass: number;

    active_from: Timestamp;
    active_from_string?: string;

    active_until: Timestamp;
    active_until_string?: string;

    active: boolean;
    future: boolean;
}