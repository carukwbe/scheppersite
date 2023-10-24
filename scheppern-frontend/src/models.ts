export interface Ticket {
    id?: string;
    name: string;
    surname: string;
    email: string;
    hogwarts_house: string;
    phone?: string;
    payed?: boolean;
    ticket_sent?: boolean;
    price?: number;
    created?: Date;
}