import { Position } from "../aforix/Position";

interface IParser {
    forex: { [name: string]: number };
    open_positions: Position[];

    getName(): string;
}

export default IParser;