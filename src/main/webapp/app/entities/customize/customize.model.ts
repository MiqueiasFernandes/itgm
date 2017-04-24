import { User } from '../../shared';
export class Customize {
    constructor(
        public id?: number,
        public sidebar?: boolean,
        public color?: string,
        public projeto?: number,
        public cenario?: number,
        public desktop?: string,
        public user?: User,
    ) {
        this.sidebar = false;
    }
}
