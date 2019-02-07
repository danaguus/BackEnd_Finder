let fs      = require('fs')
let promise = require('es6-promise').Promise

let getNumberValue = (data) => {
    return parseInt(data.toString().replace("$", "")
                                   .replace(",", ""))
}
let _FilterData = (jsonData, prop, value, twoValue = undefined) => {
    return new promise( async (resolve, reject) => {
        try {
            var jsonResult = undefined
            let resolving = (_current, _key, _value, _element, _twoValue = undefined) => {
                if ( ( _key == _value && _twoValue == undefined ) || ( _key >= _value && _key <= _twoValue ) ) {
                    if ( _current == undefined ) { _current = "[" }
                    else { _current = _current + "," }
                    return _current + JSON.stringify(_element)
                } else return _current
            }
            
            for (let index = 0; index < jsonData.length; index++) {
                const element = jsonData[index];
                switch(prop) {
                    case "city":
                        jsonResult = resolving(jsonResult, element.Ciudad, value, element)
                        break;
                    case "type":
                        jsonResult = resolving(jsonResult, element.Tipo, value, element)
                        break;
                    case "price":
                        jsonResult = resolving(jsonResult, getNumberValue(element.Precio), getNumberValue(value), element, getNumberValue(twoValue))
                        break;
                    default:
                        reject("property not found")
                        break;
                }
            }
            jsonResult =  ( jsonResult == undefined ) ? "-1" : JSON.parse(jsonResult + "]")
            resolve(jsonResult)
        } catch (exc) { reject(exc) }
    })
}

class DataManager {
    constructor() { console.clear() }

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
            if ( resultData == "-1" ) reject("-1")
            resultData = JSON.parse(resultData)
            let hasError = false

            try {
                if(objFilter != undefined) {
                    if(objFilter.city != undefined && !hasError) {
                        resultData = await _FilterData(resultData, "city", objFilter.city)
                        hasError = ( resultData == "-1" )
                    }

                    if(objFilter.type != undefined && !hasError) {
                        resultData = await _FilterData(resultData, "type", objFilter.type)
                        hasError = ( resultData == "-1" )
                    }

                    if (( objFilter.startPrice != undefined && objFilter.endPrice != undefined ) && !hasError ) {
                        resultData = await _FilterData(resultData, "price", objFilter.startPrice, objFilter.endPrice)
                        hasError = ( resultData == "-1" )
                    }
                }
            } catch (error) {
                console.log("getFilterData -> ", error)
                hasError = true
            } finally {
                if (hasError) reject("-1")
                else resolve(resultData)
            }
        })
    }
}

module.exports = DataManager