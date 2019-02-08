const FALLA = "-1"
const NOTFOUND = "0"

let fs      = require('fs')
let promise = require('es6-promise').Promise

let _getNumberValue = (data) => {
    return parseInt(data.toString().replace("$", "")
                                   .replace(",", ""))
}
let _FilterData = (jsonData, prop, value, twoValue = undefined) => {
    return new promise( async (resolve, reject) => {
        try {
            var jsonResult = undefined
            let resolving = (_current, _key, _value, _element, _twoValue = undefined) => {
                if ( ( _key == _value && _twoValue == undefined ) || 
                     ( _getNumberValue(_key) >= _getNumberValue(_value) && _getNumberValue(_key) <= _getNumberValue(_twoValue) ) 
                    ) {
                    if ( _current == undefined ) { _current = "[" }
                    else { _current = _current + "," }
                    return _current + JSON.stringify(_element)
                } else return _current
            }

            jsonData.forEach(element => {
                if (element.hasOwnProperty(prop)){
                    jsonResult = resolving(jsonResult, element[prop], value, element, twoValue)
                } else reject("property not found")
            })

            jsonResult =  ( jsonResult == undefined ) ? FALLA : JSON.parse(jsonResult + "]")
            resolve(jsonResult)
        } catch (exc) { reject(exc) }
    })
}

class DataManager {
    constructor() { }

    getData() {
        let path = (__dirname + "\\data.json")

        return new promise( resolve => {
            fs.readFile(path, "utf8", (err, result) => {
                if ( err != null ) resolve(err)
                else resolve(result)
            })
        })
    }
    getFilterData(objFilter) {
        return new promise( async (resolve, reject) => {
            let resultData = await this.getData()
            if ( resultData == FALLA ) reject(FALLA)
            resultData = JSON.parse(resultData)
            let hasError = false

            try {
                if(objFilter != undefined) {
                    if(objFilter.city != undefined && !hasError) {
                        resultData = await _FilterData(resultData, "Ciudad", objFilter.city)
                        hasError = ( resultData == FALLA )
                    }

                    if(objFilter.type != undefined && !hasError) {
                        resultData = await _FilterData(resultData, "Tipo", objFilter.type)
                        hasError = ( resultData == FALLA )
                    }

                    if (( objFilter.startPrice != undefined && objFilter.endPrice != undefined ) && !hasError ) {
                        resultData = await _FilterData(resultData, "Precio", objFilter.startPrice, objFilter.endPrice)
                        hasError = ( resultData == FALLA )
                    }
                }
            } catch (error) {
                console.log(`getFilterData -> ${error}`)
                hasError = true
            } finally {
                if (hasError) reject(FALLA)
                else resolve(resultData)
            }
        })
    }
    getField(field, sorted = false) {
        return new promise( async (resolve, reject) => {
            let fullData = await this.getData()
            if ( fullData == FALLA ) reject(FALLA)

            fullData = JSON.parse(fullData)
            if ( fullData[0].hasOwnProperty(field) ) {
                let result = fullData.reduce((a, d) => {
                    if (a.indexOf(d[field]) === -1) {
                      a.push(d[field])
                    }
                    return a
                 }, [])

                if(sorted) result.sort()
                resolve((result.length == 0 ? NOTFOUND : result))
            } else reject(`Property ${field} not found in the json file`)
        })
    }
}

module.exports = DataManager