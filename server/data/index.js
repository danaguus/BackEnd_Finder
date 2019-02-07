var DataManager = require("./storage/index.js")

module.exports = {
    getHandler: async (type, req, res) => {
        switch (type) {
            case 'index':
                    res.send("Bienvenido a mi servidor")
                    res.end()
                break;
            case 'getData':
                    let objFilter = req.body.userFilters
                    await new DataManager().getFilterData(objFilter)
                                            .then( result => {res.json(result)})
                                            .catch( exc => {res.send("No se encontró información")})
                    res.end()
                break;
            default:
                    res.sendStatus(404, "Recurso no encontrado")
                    res.end()
                break;
        }
    }
}