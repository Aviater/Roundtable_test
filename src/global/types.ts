export interface IUserObject {
    email: string;
    wallet: number;
};

export interface IUser {
    email: string;
    password: string;
    wallet: number;
};

export interface IInvitation {
    invitee: string;
    inviter: string;
    inviteId: string;
    updatedAt?: Date;
};