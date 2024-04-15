// 建立變數模組 
// 模組中必須有constructor(){}定義變數或執行function 
// 除變數外還可放布林值 數字 功能等等
// class Name{
//     constructor(參數a,參數ｂ){
            // this.變數a ＝ 參數a
            // this.變數b ＝ 參數b
            // .
            // .
            // .
//     }
//     funcitonName(){
//         function...
//     }
// }

class Calculator{
    constructor(preveriousOperandTextElement,currentOperandTextElement){
        this.preveriousOperandTextElement=preveriousOperandTextElement;
        this.currentOperandTextElement=currentOperandTextElement;
        this.clear()
    }
// 建立清空功能 在存取此模組時執行
    clear(){
        // 清空當前數字
        this.currentOperand = ''
        // 清空歷史數字
        this.preveriousOperand= ''
        // 將運算符號清除
        this.operation = undefined
    };
// 建立刪除單一數字功能
    delete(){
        // 將當前數值變為字符串並取出第一到倒數第二字元
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
    // 暫存要放在當前數值的數字
    appendNumber(number){
        // 現址只能出現一個小數點 若按下第二的小數點則直接return不執行任何動作
        if(number === '.' && this.currentOperand.includes('.')) return
        // 若新增數值不是小數點則在原有的當前數值中加上新的數字
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    // 選擇執行運算種類
    chooserOperation(operation){
        // 若當前沒有數值時選擇執行運算種類則不動作
        if (this.currentOperand === '') return
        // 如果歷史數字上有數值則執行compute()
        if (this.preveriousOperand !== ''){
            this.compute()
        }
        
        this.operation = operation
        // 想歷史數字用當前數字更新
        this.preveriousOperand = this.currentOperand
        // 將當前數字清空
        this.currentOperand = ''
    }

    // 執行運算
    compute(){
        // 定義變數 答案,歷史數字,當前數字
        let computation
        const prev = parseFloat(this.preveriousOperand)
        const current = parseFloat(this.currentOperand)
        // 如果當前歷史都沒有數字則不動作
        if(isNaN(prev) || isNaN(current)) return
        // 根據operation執行運算加減乘除
        switch(this.operation){
            case '+' :
                computation = prev + current
                break
            case '-' :
                computation = prev - current
                break
            case '*' :
                computation = prev * current
                break
            case '÷' :
                computation = prev / current
                break
            
            default:
                return
        }
        // 將當前數值更新成計算結果
        this.currentOperand = computation
        // 移除運算符號
        this.operation = undefined
        // 移除歷史數值
        this.preveriousOperand = ''
    }

    // 修飾`顯示數值 將顯示數值整數為加上千位逗號
    getDisplayNumber(number){
        // 將數值轉成字符串並分小數點前後
       const stringNumber = number.toString()
       const integerDigits = parseFloat(stringNumber.split('.')[0])
       const decimalDigits = stringNumber.split('.')[1]

       let integerDisplay 
    //    若小數點前方有數字則顯示
       if(isNaN(integerDigits)){
         integerDisplay = ''
       } else {
        // 將小數點後方數字去除並轉換成地元字符串 這邊選擇en是為何要在每千位數上加小數點
         integerDisplay = integerDigits.toLocaleString('en',{maximumFractionDigits:0})
       }
    //    當小數點後有數字則執行 將整處和小數後數字合併 並顯示
       if(decimalDigits != null){
        return `${integerDisplay}.${decimalDigits}`
       }else{
        return integerDisplay
       }
    }

    // 將暫存的數字渲染到顯示區上
    updateDisplay(){
        // 在顯示區上放上經過getDisplayNumber()修飾後的當前數值
        this.currentOperandTextElement.innerHTML = this.getDisplayNumber(this.currentOperand)
        // 若有要執行的運算符號則在歷史數字顯示居上放上修飾過得歷史數字和要執行的運算
        if(this.operation !=null ){
            this.preveriousOperandTextElement.innerHTML = 
            `${this.getDisplayNumber(this.preveriousOperand)} ${this.operation}`
        }else {
            // 若沒有接下來要執行的運算 (按下等號) 則將歷史數字顯示區清空
            this.preveriousOperandTextElement.innerText = ''
          }

    }
}

// 定義個按鍵的變數
const numberButtons= document.querySelectorAll('[data-number]');
const operationButtons= document.querySelectorAll('[data-operation]');
const equalsButtons= document.querySelector('[data-equals]');
const deleteButtons= document.querySelector('[data-delete]');
const allClearButtons= document.querySelector('[data-all-clear]');
const preveriousOperandTextElement= document.querySelector('[data-preverious-operand]');
const currentOperandTextElement= document.querySelector('[data-current-operand]');

const calculator = new Calculator(preveriousOperandTextElement,currentOperandTextElement)

// 賦予每個按鍵功能
numberButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        calculator.appendNumber(button.innerHTML)
        calculator.updateDisplay()
    })
})

operationButtons.forEach(button => {
    button.addEventListener('click', ()=>{
        calculator.chooserOperation(button.innerHTML)
        calculator.updateDisplay()
    })
})

equalsButtons.addEventListener('click', button =>{
        calculator.compute()
        calculator.updateDisplay()
})

allClearButtons.addEventListener('click', button =>{
    calculator.clear()
    calculator.updateDisplay()
})

deleteButtons.addEventListener('click', button =>{
    calculator.delete()
    calculator.updateDisplay()
})