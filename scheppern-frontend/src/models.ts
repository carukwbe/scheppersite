import { AbstractControl, FormGroup } from "@angular/forms";
import { Timestamp } from "firebase/firestore";

export interface Ticket {
    id?: string;
    order_id?: string;

    name: string;
    surname: string;
    email: string;
    phone?: string;

    status?: "ordered" | "payed" | "pending" | "scanned";
    price?: number;
    carpass: boolean;
    helper: boolean;
    helper_shifts?: string;
    helper_infos?: string;

    old_ticketID?: string;
    secret?: boolean;
}

export interface TicketForm extends FormGroup {
    controls: {
        name: AbstractControl;
        surname: AbstractControl;
        email: AbstractControl;
        phone: AbstractControl;

        carpass: AbstractControl;
        carpassWish: AbstractControl;

        helper: AbstractControl;
        helperWish: AbstractControl;
        helperShifts: AbstractControl;
        helperInfos: AbstractControl;

        agbsAccepted: AbstractControl;
        dataProtectionAccepted: AbstractControl;
        over18: AbstractControl;
        secret?: AbstractControl;
    };
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