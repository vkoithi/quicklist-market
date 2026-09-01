const form = document.querySelector("form")

const input = document.getElementById("newItem")

const unitSelect = document.getElementById("unit")

const list = document.querySelector("ul")

const alert = document.querySelector(".alert")

const alertMessage = document.querySelector(".alert span")

const closeAlert = document.querySelector(".close-alert")

const shareList = document.getElementById("share-list")

const clearList = document.getElementById("clear-list")

const totalText =  document.getElementById("total-value")

let alertTimer

let itemId = 0

let items =
  JSON.parse(localStorage.getItem("quicklist-items")) || []

function updateTotal() {
    let total = 0

    items.forEach((itemData) => {
        total += itemData.quantity * itemData.price
    })

    totalText.textContent =
        total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
}  

function showAlert(message) {
  clearTimeout(alertTimer)

  alertMessage.textContent = message

  alert.classList.remove("hidden")
  alert.classList.remove("alert-out")
  alert.classList.add("alert-in")

  alertTimer = setTimeout(() => {
    alert.classList.remove("alert-in")
    alert.classList.add("alert-out")

    setTimeout(() => {
      alert.classList.add("hidden")
      alert.classList.remove("alert-out")
    }, 500)
  }, 3000)
}

function createShareLink() {
  const listData = JSON.stringify(items)
  
  const encodedList = encodeURIComponent(listData)

  return `${window.location.origin}${window.location.pathname}#list=${encodedList}`
}

function createItem(itemData) {
  const item = document.createElement("li")

  const isKg = itemData.unit === "kg"

  if (itemData.price === undefined) {
    itemData.price = 0
  }

  item.classList.add("item-in")

  const subtotalText = document.createElement("strong")
  subtotalText.classList.add("item-subtotal")

  function updateSubtotal() {
    const subtotalValue = itemData.quantity * itemData.price

    subtotalText.textContent = 
        `Subtotal: ${subtotalValue.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })}`
  }

  // Checkbox
  const checkbox = document.createElement("input")

  checkbox.type = "checkbox"
  checkbox.checked = itemData.checked

  if (itemData.checked) {
    item.classList.add("checked-item")
  }

  itemId++

  checkbox.id = `item-${itemId}`


  // Nome do item
  const label = document.createElement("label")

  label.textContent = itemData.name
  label.htmlFor = checkbox.id


  // Texto da quantidade
  const quantityLabel = document.createElement("span")

  if (isKg) {
    quantityLabel.textContent = "Kg:"
  } else {
    quantityLabel.textContent = "Quantidade:"
  }

  // Botão diminuir
  const decreaseButton = document.createElement("button")

  decreaseButton.type = "button"
  decreaseButton.textContent = "-"
  decreaseButton.classList.add("quantity-button")

  decreaseButton.setAttribute(
    "aria-label",
    `Diminuir quantidade de ${itemData.name}`
  )


  // Campo da quantidade
  const quantity = document.createElement("input")

  quantity.type = "number"
  
  if (isKg) {
    quantity.min = "0.01"
    quantity.step = "0.01"
  } else {
    quantity.min = "1"
    quantity.step = "1"
  }

  quantity.value = itemData.quantity

  quantity.classList.add("quantity-input")

  quantity.setAttribute(
    "aria-label",
    `Quantidade de ${itemData.name}`
  )


  // Botão aumentar
  const increaseButton = document.createElement("button")

  increaseButton.type = "button"
  increaseButton.textContent = "+"
  increaseButton.classList.add("quantity-button")

  increaseButton.setAttribute(
    "aria-label",
    `Aumentar quantidade de ${itemData.name}`
  )


  // Diminuir quantidade
  decreaseButton.addEventListener("click", () => {
    if (isKg) {
      if (itemData.quantity > 0.1) {
        itemData.quantity = 
           Number((itemData.quantity - 0.1).toFixed(2))
      }
    } else {
      if (itemData.quantity > 1) {
        itemData.quantity--
      }
    }

    quantity.value = itemData.quantity

    updateSubtotal()
    updateTotal()
    
    localStorage.setItem(
      "quicklist-items",
      JSON.stringify(items)
    )
  })

  // Aumentar quantidade
  increaseButton.addEventListener("click", () => {
    if (isKg) {
      itemData.quantity = 
        Number((itemData.quantity + 0.1).toFixed(2))
    } else {
      itemData.quantity++
    }

    quantity.value = itemData.quantity

    updateSubtotal()
    updateTotal()

    localStorage.setItem(
      "quicklist-items",
      JSON.stringify(items)
    )
  })

  // Alterar quantidade manualmente
  quantity.addEventListener("change", () => {
    const newQuantity = Number(quantity.value)

    if (isKg) {
      if (newQuantity <= 0) {
        itemData.quantity = 0.1
        quantity.value = 0.1
      } else {
        itemData.quantity = newQuantity 
      }
    } else {
        if (
          newQuantity < 1 ||
          !Number.isInteger(newQuantity)
        ) {
          itemData.quantity = 1
          quantity.value = 1 
        } else {
          itemData.quantity = newQuantity
        }
    }

    updateSubtotal()
    updateTotal()

    localStorage.setItem (
      "quicklist-items",
      JSON.stringify(items)
    )
  })

  // Controles da quantidade
  const quantityControls = document.createElement("div")

  quantityControls.classList.add("quantity-controls")

  quantityControls.append(
    quantityLabel,
    decreaseButton,
    quantity,
    increaseButton
  )

  // Preço do produto

const priceLabel = document.createElement("span")

if (isKg) {
  priceLabel.textContent = "Preço/kg: R$"
} else {
  priceLabel.textContent = "Preço/un: R$"
}

const priceInput = document.createElement("input")

priceInput.type = "number"
priceInput.min = "0"
priceInput.step = "0.01"
priceInput.placeholder = "0.00"

priceInput.classList.add("price-input")

priceInput.setAttribute(
  "aria-label",
  `Preço de ${itemData.name}`
)

if (itemData.price > 0) {
  priceInput.value = itemData.price
}

priceInput.addEventListener("change", () => {
  const newPrice = Number(priceInput.value)

  if (newPrice < 0 || Number.isNaN(newPrice)) {
    itemData.price = 0
    priceInput.value = ""
  } else {
    itemData.price = newPrice
  }

  updateSubtotal()
  updateTotal()

  localStorage.setItem(
    "quicklist-items",
    JSON.stringify(items)
  )
})

const priceControls = document.createElement("div")

priceControls.classList.add("price-controls")

priceControls.append(
  priceLabel,
  priceInput
)
  
  // Botão remover
  const removeButton = document.createElement("button")

  removeButton.type = "button"

  removeButton.setAttribute(
    "aria-label",
    `Remover ${itemData.name}`
  )

  removeButton.innerHTML = `
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M16.25 4.58325L15.7336 12.9375C15.6016 15.0719 15.5357 16.1392 15.0007 16.9065C14.7361 17.2858 14.3956 17.606 14.0006 17.8466C13.2017 18.3333 12.1325 18.3333 9.99392 18.3333C7.8526 18.3333 6.78192 18.3333 5.98254 17.8457C5.58733 17.6047 5.24667 17.2839 4.98223 16.9039C4.4474 16.1354 4.38287 15.0667 4.25384 12.9293L3.75 4.58325"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
      />

      <path
        d="M2.5 4.58342H17.5M13.3797 4.58342L12.8109 3.40986C12.433 2.6303 12.244 2.24051 11.9181 1.99742C11.8458 1.9435 11.7693 1.89553 11.6892 1.854C11.3283 1.66675 10.8951 1.66675 10.0287 1.66675C9.14067 1.66675 8.69667 1.66675 8.32973 1.86185C8.24842 1.90509 8.17082 1.955 8.09774 2.01106C7.76803 2.264 7.58386 2.66804 7.21551 3.47613L6.71077 4.58342"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
      />

      <path
        d="M7.91687 13.75V8.75"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
      />

      <path
        d="M12.0831 13.75V8.75"
        stroke="currentColor"
        stroke-width="1.25"
        stroke-linecap="round"
      />
    </svg>
  `


  // Marcar / desmarcar
  checkbox.addEventListener("change", () => {
    itemData.checked = checkbox.checked

    item.classList.toggle(
      "checked-item",
      checkbox.checked
    )

    if (checkbox.checked) {
      const index = items.indexOf(itemData)

      if (index !== -1) {
        items.splice(index, 1)
        items.push(itemData)
      }

      list.append(item)
    }

    localStorage.setItem(
      "quicklist-items",
      JSON.stringify(items)
    )
  })


  // Remover item
  removeButton.addEventListener("click", () => {
    const index = items.indexOf(itemData)

    if (index !== -1) {
      items.splice(index, 1)
    }

    localStorage.setItem(
      "quicklist-items",
      JSON.stringify(items)
    )

    item.remove()

    updateTotal()

    showAlert("O item foi removido da lista")
  })

  const itemTop = document.createElement("div")
    itemTop.classList.add("item-top")

  const itemDetails = document.createElement("div")
    itemDetails.classList.add("item-details")

    itemTop.append(
      checkbox,
      label,
      removeButton
    )

  updateSubtotal()

  itemDetails.append(
    quantityControls,
    priceControls,
    subtotalText
  )

  item.append(
    itemTop,
    itemDetails
  )

  list.append(item)
}

// Carrega os itens salvos
loadSharedList()

items.forEach((itemData) => {
  createItem(itemData)
})

updateTotal()


// Adicionar novo item
form.onsubmit = (event) => {
  event.preventDefault()

  const value = input.value.trim()

  if (value === "") {
    return
  }

  const formattedValue =
    value.charAt(0).toUpperCase() +
    value.slice(1)

  const itemData = {
    name: formattedValue,
    checked: false,
    quantity: 1,
    unit: unitSelect.value,
    price: 0
  }

  items.push(itemData)

  localStorage.setItem(
    "quicklist-items",
    JSON.stringify(items)
  )

  createItem(itemData)

  updateTotal()

  input.value = ""
  unitSelect.value = "un"
  input.focus()
}


// Limpar toda a lista
clearList.addEventListener("click", () => {
  items = []

  localStorage.removeItem("quicklist-items")

  list.innerHTML = ""

  updateTotal()

  showAlert("Você limpou sua lista")
})


// Fechar alerta manualmente
closeAlert.addEventListener("click", () => {
  clearTimeout(alertTimer)

  alert.classList.remove("alert-in")
  alert.classList.add("alert-out")

  setTimeout(() => {
    alert.classList.add("hidden")
    alert.classList.remove("alert-out")
  }, 500)
})

shareList.addEventListener("click", async () => {
  if (items.length === 0) {
    showAlert("Sua lista está vazia")
    return
  }

  const shareLink = createShareLink()

  try {
    if (navigator.share) {
      await navigator.share({
        title: "QuickList",
        text: "Minha lista de compras",
        url: shareLink
      })
    } else {
      await navigator.clipboard.writeText(shareLink)

      showAlert("Link da lista copiado")
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showAlert("Não foi possível compartilhar a lista")
    }
  }
})

function loadSharedList() {
  const hash = window.location.hash

  if (!hash.startsWith("#list=")) {
    return
  }

  const encodedList = hash.replace("#list=", "")

  try {
    const decodedList = decodeURIComponent(encodedList)

    const sharedItems = JSON.parse(decodedList)

    items = sharedItems

    localStorage.setItem(
      "quicklist-items",
      JSON.stringify(items)
    )

  } catch (error) {
    showAlert("Não foi possível carregar a lista compartilhada")
  }
}