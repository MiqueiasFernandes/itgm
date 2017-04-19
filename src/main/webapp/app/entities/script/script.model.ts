import { Cenario } from '../cenario';
export class Script {
    constructor(
        public id?: number,
        public nome?: string,
        public codigo?: string,
        public status?: string,
        public cenario?: Cenario,
    ) {
    }
}
