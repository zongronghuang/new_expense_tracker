const editConfirmBtn = document.querySelector('#edit-confirm')

editConfirmBtn.addEventListener('click', event => {
  const categoryValue = document.querySelector('#category').selectedOptions[0].innerText
  const nameValue = document.querySelector('#name').value
  const dateValue = document.querySelector('#date').value
  const retailerValue = document.querySelector('#retailer').value
  const amountValue = document.querySelector('#amount').value

  const editCategory = document.querySelector('#edit-category')
  const editName = document.querySelector('#edit-name')
  const editDate = document.querySelector('#edit-date')
  const editRetailer = document.querySelector('#edit-retailer')
  const editAmount = document.querySelector('#edit-amount')

  editCategory.textContent = categoryValue
  editName.textContent = nameValue
  editDate.textContent = dateValue
  editRetailer.textContent = retailerValue
  editAmount.textContent = amountValue
})