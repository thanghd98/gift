// @ts-nocheck

const bigDecimal = require('js-big-decimal')
import numeral from 'numbro'

export const convertBalanceToWei = (strValue: string, iDecimal: string | number = 18, options?: {
    isFormat?: boolean
  }) => {
    strValue = '' + strValue
  
    if(Number(strValue) === 0) return 0 ;
  
    try {
      const multiplyNum = new bigDecimal(Math.pow(10, iDecimal))
      const convertValue = new bigDecimal(String(strValue))
      const result = multiplyNum.multiply(convertValue)
      if (options?.isFormat) {
        return formatMoney(result.getValue()) as any
      }
  
      return result.getValue() as any
    } catch (error) {
      return 0
    }
}
  
export const convertWeiToBalance = (strValue: string, iDecimal: string | number = 18, options?: {
    isFormat?: boolean
  }) => {
    strValue = '' + strValue
  
    if(Number(strValue) === 0) return 0 ;
    
    try {
      const decimalFormat = parseFloat(iDecimal.toString())
      const multiplyNum = new bigDecimal(Math.pow(10, decimalFormat))
      const convertValue = new bigDecimal(String(strValue))
      const result = convertValue.divide(multiplyNum, decimalFormat)
      const res = result.round(iDecimal, bigDecimal.RoundingModes.DOWN)
  
      if (options?.isFormat) {
        return formatMoney(res.getValue())
      }
  
      return res.getValue() as any
    } catch (error) {
      return 0
    }
}

export const formatNumberBro = (number: string |number, mantissa?: number = 4, isReturnNaN?: boolean, textNa?: string, trimMantissa?: boolean = true) => {
    if (number !== false && number !== 'null' && !(number === null) && !isNaN(number) && !(number === undefined) && number !== 'NaN' && number !== Infinity) {
      if (number.toString().length > 0) {
        return numeral(number.toString().replace(/,/g, '')).format({ trimMantissa, thousandSeparated: true, mantissa, roundingFunction: Math.floor })
      }
    }
    return isReturnNaN ? (textNa || 'N/A') : 0
}

export const formatMoney = (price = '', decimals = 2): string => {
    let mantissa = decimals
    const strPrice = price.toString()
  
    const beforeDot = strPrice.split('.')[0]
    const afterDot = strPrice.split('.')[1] ? strPrice.split('.')[1].split('') : null
    const fBefore = beforeDot?.length
    if (fBefore > 1 && fBefore < 3) {
      mantissa = 2
    }
  
    if (fBefore <= 1) {
      mantissa = 4
  
      const countZero = afterDot ? afterDot.filter(it => it.toString() === '0')?.length : 0
      if (afterDot && countZero > 2) {
        mantissa = 6
      }
    }
  
    return formatNumberBro(price, mantissa)
}
  