let DataManager = require("./storage/index.js")
let path        = require("path")

/*
 * Exportamos función para administrar las peticiones tipo GET que haga el cliente.
 */
module.exports = {
    getHandler: async (type, req, res) => {
        /* Se asigna propiedad al encabezado de la respuesta para que el lado cliente pueda leer el resultado. */
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin == undefined ? "*" : req.headers.origin)
        switch (type) {
            case 'index':
                    /* Enrutamos la respuesta a la página principal del sitio. */
                    res.sendFile(path.join(__dirname, "../../public", "index.html"))
                break;
            case 'getData':
                    await new DataManager().getFilterData(req.query.userFilters)
                                            .then( result => { res.json(result) })
                                            .catch( exc => { console.log(exc); res.send("No se encontró información")})
                    res.end()
                break;
            case 'getField':
                    await new DataManager().getField(req.query.field, req.query.sortedField)
                                            .then( result => { res.json(result) } )
                                            .catch( exc => { console.log(exc); res.send(exc) } )
                    res.end()
                break;
            default:
                    res.sendStatus(404, "Recurso no encontrado")
                    res.end()
                break;
        }
    }
}