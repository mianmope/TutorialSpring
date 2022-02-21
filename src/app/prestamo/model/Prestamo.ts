import { Game } from "src/app/game/model/Game";
import { Cliente } from "src/app/cliente/model/Cliente";

export class Prestamo {
    id: number;
    game: Game;
    cliente: Cliente;
    dateIni: Date;
    dateFin: Date;
}
