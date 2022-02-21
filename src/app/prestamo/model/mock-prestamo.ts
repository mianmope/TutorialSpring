import { PrestamoPage } from "./PrestamoPage"

export const PRESTAMO_DATA: PrestamoPage = {
    content: [
        { id: 1, game:{ id: 1, title: 'Juego 1', age: 6, category: { id: 1, name: 'Categoría 1' }, author: { id: 1, name: 'Autor 1', nationality: 'Nacionalidad 1' } }
        , cliente:{ id: 1, name: 'Cliente 1' },dateIni: new Date('December 17, 2022'), dateFin: new Date('December 20, 2022') },
        { id: 2, game:{ id: 2, title: 'Juego 2', age: 8, category: { id: 1, name: 'Categoría 1' }, author: { id: 2, name: 'Autor 2', nationality: 'Nacionalidad 2' }},
        cliente:{ id: 2, name: 'Cliente 2' },dateIni: new Date('December 25, 2022'), dateFin: new Date('December 27, 2022') },
        { id: 3, game:{ id: 3, title: 'Juego 3', age: 4, category: { id: 1, name: 'Categoría 1' }, author: { id: 3, name: 'Autor 3', nationality: 'Nacionalidad 3' } }
        , cliente:{ id: 3, name: 'Cliente 3' },dateIni: new Date('December 17, 2022'), dateFin: new Date('December 20, 2022') },
    ],  
    pageable : {
        pageSize: 5,
        pageNumber: 0,
        sort: [
            {property: "id", direction: "ASC"}
        ]
    },
    totalElements: 3
}