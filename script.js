const CREDIT_MIN = 0
const CREDIT_MAX = 20000000

const FIRST_CONTRIBUTION_MIN = 0
const FIRST_CONTRIBUTION_MAX = 15000000

const PERIOD_MIN = 1
const PERIOD_MAX = 40


const creditText = document.querySelector('#creditText')
const creditRange = document.querySelector('#creditRange')

const firstContributionText = document.querySelector('#firstContributionText')
const firstContributionRange = document.querySelector('#firstContributionRange')

const returnPeriodText = document.querySelector('#returnPeriodText')
const returnPeriodRange = document.querySelector('#returnPeriodRange')


const formatterNumber = new Intl.NumberFormat('ru')

const formatterCurrency = new Intl.NumberFormat('ru', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0
})

const formatterDate = {
  format (number) {
    const years = parseInt(number)
    let count = years % 10
    let text = ' лет'

    if (years >= 5 && years <= 20) {
      text = ' лет'
    } else if (count == 1) {
      text = ' год'
    } else if (count >=2 && count <= 4) {
      text = ' года'
    } 

    return years + text
  }
}


setdoubleDependencies(
  creditText, 
  creditRange, 
  formatterNumber, 
  formatterCurrency, 
  CREDIT_MIN, 
  CREDIT_MAX
)

setdoubleDependencies(
  firstContributionText, 
  firstContributionRange, 
  formatterNumber, 
  formatterCurrency, 
  FIRST_CONTRIBUTION_MIN, 
  FIRST_CONTRIBUTION_MAX
)

setdoubleDependencies(
  returnPeriodText, 
  returnPeriodRange, 
  formatterNumber, 
  formatterDate, 
  PERIOD_MIN, 
  PERIOD_MAX
)

setReaction(
  creditText, 
  creditRange,
  firstContributionText, 
  firstContributionRange, 
  returnPeriodText, 
  returnPeriodRange,
  mainProcess
)

mainProcess()

function setdoubleDependencies(textElement, rangeElement, formatterNumber, formatterGoal, min, max) {
  rangeElement.setAttribute('min', min)
  rangeElement.setAttribute('max', max)
  textElement.value = formatterGoal.format(parseInt((min + max) / 2))
  
  
  textElement.addEventListener('focus', function (event) {
    let number = ''
    for (const letter of this.value) {
      if ('0123456789'.includes(letter)) {
        number += letter
  
      }
    }
  
    number = parseInt(number)
    this.value = formatterNumber.format(number)
  })
  
  textElement.addEventListener('input', function (event) {
    let number = ''
    for (const letter of this.value) {
      if ('0123456789'.includes(letter)) {
        number += letter
  
      }
    }
  
    number = parseInt(number)
    if (number < min) {
      number = min
    }
    if (number > max) {
      number = max
    }
  
    rangeElement.value = number
  
    number = formatterNumber.format(number)
    this.value = number
  
  })
  
  textElement.addEventListener('blur', function (event) {
    let number = ''
    for (const letter of this.value) {
      if ('0123456789'.includes(letter)) {
        number += letter
  
      }
    }
  
    number = parseInt(number)
    this.value = formatterGoal.format(number)
  })
  
  rangeElement.addEventListener('input', function (event) {
    textElement.value = formatterGoal.format(parseInt(this.value))
  })

}

function setReaction (...args) {
  const handler = args.splice(-1)[0]
  for (const element of args) {
    element.addEventListener('input', function (event) {
      handler.call(this, event, args.slice())
    })
  }
}

function mainProcess() {
  const credit = parseInt(creditRange.value)
  const firstContribution = parseInt(firstContributionRange.value)
  const returnPeriod =  parseInt(returnPeriodRange.value)

  let percent = 10 + Math.log(returnPeriod) / Math.log(0.5)
  percent = parseInt(percent * 100 + 1) / 100
  document.querySelector('#percentNumber').value = percent + ' %'

  let commonDebit = (credit - firstContribution) * (1 + percent) ^ returnPeriod
  document.querySelector('#common').textContent = formatterCurrency.format(commonDebit)

  const subpayment = commonDebit - (credit - firstContribution)
  document.querySelector('#subpayment').textContent = formatterCurrency.format(subpayment)

  const payment = subpayment / (returnPeriod * 12)
  document.querySelector('#payment').textContent = formatterCurrency.format(payment)
} 