import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalcService {

  constructor() { }
  result: number
  calcExp(operand1: any, operand2:any, operation: any): number{
    switch(operation){
      case '+':
        this.result =  parseFloat(operand1) + parseFloat(operand2)
      break
      case '-':
        this.result =  parseFloat(operand2) - parseFloat(operand1)
      break
      case 'x':
        this.result =  parseFloat(operand1) * parseFloat(operand2)
      break
      case '/':
        this.result =  parseFloat(operand2) / parseFloat(operand1)
      break
    }
    return this.result
  }

  calcExpWithSpecOper(operand1: any, operation: any):number{
    switch(operation){
      case '√':
        this.result =  Math.sqrt(parseFloat(operand1))
      break
      case '%':
        this.result =  parseFloat(operand1) / 100
      break
    }
    return this.result
  }
}
