var DataManager = require("./storage/index.js")

module.exports = {
    getHandler: async (type, req, res) => {
        switch (type) {
            case 'index':
                    res.send("Bienvenido a mi servidor")
                    res.end()
                break;
            case 'getData':
                    await new DataManager().getFilterData(req.body.userFilters)
                                            .then( result => {res.json(result)})
                                            .catch( exc => { console.log(exc); res.send("No se encontró información")})
                    res.end()
                break;
            case 'getField':
                    await new DataManager().getField(req.body.field, req.body.sortedField)
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