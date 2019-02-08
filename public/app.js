let sendAjaxRequest = (url, data = undefined, type = "GET") => {
  return new Promise( (resolve, reject) => {
    $.ajax({
      url: url,
      type: type,
      data: data,
      success: (result, status, xhr) => {
        resolve(result)
      },
      error: (xhr, status, error) => {
        console.log(xhr,status,error)
        reject(error)
      }
    })
  })
}
let getInfoTag = (row) => {
  return `<div class='card horizontal'>
            <div class='card-image'>
              <img src='img/home.jpg'>
            </div>
            <div class='card-stacked'>
              <div class='card-content'>
                <div>
                  <p><b>Direccion:</b> ${row.Direccion}</p>
                </div>
                <div>
                  <p><b>Ciudad: </b> ${row.Ciudad}</p>
                </div>
                <div>
                  <p><b>Telefono: </b> ${row.Telefono}</p>
                </div>
                <div>
                  <p><b>Código postal: </b> ${row.Codigo_Postal}</p>
                </div>
                <div>
                  <p><b>Precio: </b> ${row.Precio}</p>
                </div>
                <div>
                  <p><b>Tipo: </b> ${row.Tipo}</p>
                </div>
              </div>
            </div>
          </div>`
}
let getCitysFromServer = async () => {
  let citys = await sendAjaxRequest("/getField", { field: "Ciudad", sortedField: true })

  citys.forEach(city => {
    $("#ciudad").append(`<option value="${city}">${city}</option>`)
  })
}
let getTypesFromServer = async () => {
  let types = await sendAjaxRequest("/getField", { field: "Tipo", sortedField: true })

  types.forEach(type => {
    $("#tipo").append(`<option value="${type}">${type}</option>`)
  })
}
let buildInformationPanel = async () => {
  $(".lista>*").remove()
  $(".progressing").show()
  let userFilters = {
    city: $("#ciudad").val() == '' ? undefined : $("#ciudad").val(),
    type: $("#tipo").val() == '' ? undefined : $("#tipo").val(),
    startPrice: $("#rangoPrecio").val().split(";")[0],
    endPrice: $("#rangoPrecio").val().split(";")[1]
  }
  if (!($("#checkPersonalizada")[0].checked)) userFilters = undefined
  let fullData = await sendAjaxRequest("/getData", {userFilters})

  try {
    if (typeof(fullData) == "string") M.toast({html: fullData})
    else {
      $(".lista>*").remove()
      $(".lista").append(`<h5>${fullData.length} registros encontrados</h5>`)
      fullData.forEach(row => {
        $(".lista").append(getInfoTag(row))
      })
    }
  } catch (exc) {
    M.toast({html: exc})
  } finally {
    $(".progressing").hide()
  }
}

$(document).ready(() => {
  (async () => {
    await getCitysFromServer()
    await getTypesFromServer()
    $('#checkPersonalizada').on('change', (e) => {
      if (this.customSearch == false) {
        this.customSearch = true
      } else {
        this.customSearch = false
      }
      $('#personalizada').toggleClass('invisible')
    })
    $("#buscar").on("click", () => {
      buildInformationPanel()
    })
    //Inicializador del elemento Slider
    $("#rangoPrecio").ionRangeSlider({
      type: "double",
      grid: false,
      min: 0,
      max: 100000,
      from: 1000,
      to: 50000,
      prefix: "$"
    })
    $('select').formSelect()

    $(".progressing").hide()
  })()
})