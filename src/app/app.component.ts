import { Component } from '@angular/core';
import { CalcService } from './calc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  constructor(public calc: CalcService){}
  //Переменные(в данных переменных не указан тип, так как тут явно прописано чему равна данная переменная)
  input = ''
  expression = ''
  calculation = ''
  operand1 = 0
  operand2 = 0
  operatorRepeat = false
  digit :string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00', '.']
  action :string[] = ['/', 'x', '-', '+']
  specOper: string[] = ['√', '%']
  straples: string[] = ['(', ')']
  orderOfOperation = {
    '+': 1,
    '-': 1,
    'x': 2,
    '/': 2,
    '√': 3,
    '%': 3
  }
  //=========================================================================================================================================
  // Метод allClear вызывается при нажатии на кнопку escape и полностью очищает калькулятор и переменные, которые задействуются в программе
  allClear():void{
    this.input = ''
    this.expression = ''
    this.operand1 = 0;
    this.operand2 = 0
    this.operatorRepeat = false
  }
  //=========================================================================================================================================
  // Метод clear убирает последний введенный элемент
  clear(): void{
    this.input = this.input.slice(0, -1)
  }
  //=========================================================================================================================================
  //Метод pressKey вызывается при нажатии на кнопки калькулятора(за исключением С и =) и клавиши клавиатуры
  pressKey(key: string): undefined{
    if(key === 'Escape'){
      this.allClear()
      return undefined
    }
    if (this.action.includes(key) || this.specOper.includes(key)) { // Проверка на то, нажаты(введены) ли клавиши, относящиеся к массиву action или specOper
      //Здесь выполняется проверки для того, чтобы не пропускать, например повторный ввод символов мат.операций
      if ((this.input === '' && this.action.includes(key)) || (this.action.includes(this.input[this.input.length - 1]) && !this.specOper.includes(key)) || (this.specOper.includes(key) && (this.input[this.input.length - 1] === key) || (this.input[this.input.length - 1] === '(' && !this.specOper.includes(key)))) {
        return undefined
      }
    }
    if((this.digit.includes(key) && this.input[this.input.length - 1] === ')')){
      return undefined
    }
    // В данном условии мы обеспечиваем ожидаемое поведении backspace
    if(key === 'Backspace'){
      this.input = this.input.slice(0, -1)
      return undefined
    }
    // Данное условие сделано для соответствия умножения на интрефейсе калькулятора и при вводе с клавиатуры
    if(key === '*'){
      key = 'x'
    }
    // Данное условие предназначено для того, чтобы не пропускать клавиши, которые являются некорректными в процессе работы калькулятора(например буквы)
    if(!this.action.includes(key) && !this.digit.includes(key) && !this.specOper.includes(key) && !this.straples.includes(key)){
      return undefined
    }
    this.input += key // Данной строкой мы наполняем переменную input вводимые данными
    return undefined
  }
  //=========================================================================================================================================
  // Метод getAnswer вызывается при нажатии на интерфейсе калькулятора кнопки = и нажатии клавиши Enter с клавиатуры
  getAnswer(input:string): string{
    let res: number
    this.expression = input // Заносим input в переменную, которая используется для вывода конечного уравнения в тег p с классом calculator__final-expression
    this.calculation = input // Заносим input в переменную, которая будет использоваться в дальнейших расчётах
    let calcArr: string[] = []  // В данный массив будет заноситься элементы полученной строки (calculation)
    // Идея данного участка кода заключается в следующем:
    //1)Происходит разделение строки на элементы
    //2) Если у нас это элементы мат.операций или скобки, то ставится запятая с одной или с 2 сторон от этого элемента
    //3) Далее собираем строку с этими запятыми
    //4) Сплитим данную строку по запятым и получаем элементы нашего мат.выражения
    // Такая логика необходима разделения мат.выражения по элементам для того, чтобы получить флаги по которым разделять строку
    for(let i = 0; i < this.calculation.length; i++){
      let strPlug: string
      if(this.action.includes(this.calculation[i])){
        strPlug = `,${this.calculation[i]},` // Здесь требуется строка затычка, так как при записи this.calculation[i] = `,${this.calculation[i]},` выдается ошибка, что this.calculation[i] доступна только для чтения
        calcArr.push(strPlug)
      } else if(this.specOper.includes(this.calculation[i]) || this.calculation[i] === '('){
        strPlug = `${this.calculation[i]},`
        calcArr.push(strPlug)
      } else if(this.calculation[i] === ')'){
        strPlug = `,${this.calculation[i]}`
        calcArr.push(strPlug)
      }
      else{
        calcArr.push(this.calculation[i])
      }
    }
    this.calculation = calcArr.join('')
    calcArr = this.calculation.split(',')
    let stackOfNumbers: string[] = []
    let stackOfOperation: string[] = []
    calcArr.forEach((e) => {
      if(!(this.action.includes(e) || this.specOper.includes(e) || this.straples.includes(e))){
        console.log('1');
        stackOfNumbers.push(e)
        console.log(stackOfNumbers);
        console.log(stackOfOperation);
        return
      } else{
        if(e === ')'){
          do{
              let a = stackOfNumbers.pop()
              let b = stackOfNumbers.pop()
              let c = stackOfOperation.pop()
              stackOfNumbers.push(this.calc.calcExp(a, b, c).toString())
          }while(!(stackOfOperation[stackOfOperation.length - 1] === '('))
          stackOfOperation.splice(-1, 1)
          return
        } else if(this.orderOfOperation[stackOfOperation[stackOfOperation.length - 1] as keyof typeof this.orderOfOperation] >= this.orderOfOperation[e as keyof typeof this.orderOfOperation]){
          console.log('3');
          do{
              let a = stackOfNumbers.pop()
              let b = stackOfNumbers.pop()
              let c = stackOfOperation.pop()
              stackOfNumbers.push(this.calc.calcExp(a, b, c).toString())
          }while(!(stackOfOperation[stackOfOperation.length - 1] === '(' || stackOfOperation[stackOfOperation.length - 1] === ')' || stackOfOperation.length === 0 || this.orderOfOperation[stackOfOperation[stackOfOperation.length - 1] as keyof typeof this.orderOfOperation] < this.orderOfOperation[e as keyof typeof this.orderOfOperation]))
          stackOfOperation.push(e)
          console.log(stackOfNumbers);
          console.log(stackOfOperation);
          return
        } else{
          console.log('4');
          stackOfOperation.push(e)
          console.log(stackOfNumbers);
          console.log(stackOfOperation);
          return
        }
      }
    })
    if((stackOfNumbers.length >= 2 && stackOfOperation.length >= 1)){
      for(let i = 0; i<=stackOfOperation.length; i++){
          let a = stackOfNumbers.pop()
          let b = stackOfNumbers.pop()
          let c = stackOfOperation.pop()
          stackOfNumbers.push(this.calc.calcExp(a, b, c).toString())
        }
      } else{
      this.input = 'Ошибка'
      }
      this.input = stackOfNumbers[0]
      console.log(stackOfNumbers);
      console.log(stackOfOperation);
      return this.input
    }
  }


















