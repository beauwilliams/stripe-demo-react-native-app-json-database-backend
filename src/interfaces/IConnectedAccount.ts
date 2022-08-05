interface ConnectedAccount {
    id: number;
    account_id: string;
    account_link_creation: number;
    account_link_expiry: number;
    url: string;
    display_name: string;
    currency: string;
}

export { ConnectedAccount };
