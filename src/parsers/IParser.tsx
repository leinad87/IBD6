import forex from "../aforix/Forex";
import { Position } from "../aforix/Position";

interface IParser {
    forex: { [name: string]: forex };
    open_positions: Position[];

    getName(): string;
}

export default IParser;