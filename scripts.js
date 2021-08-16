const Modal ={
  /*criando funcionalidades*/
  open (){
      //abrir modal
      //adicionar a class active ao modal
      document    
          .querySelector('.modal-overlay')
          .classList
          .add('active')
  },
  close(){
      //fechar o modal
      //remover a class active do modal 
      document    
          .querySelector('.modal-overlay')
          .classList
          .remove('active')
  }
}


const Storage ={
  //guardando as informações no local storage
  get (){
     //convertendo string para um array
     return JSON.parse(localStorage.getItem("dev.finances:transactions"))|| []
  },

  set(transactions){
    //transformando array em uma string
    localStorage.setItem("dev.finances:transactions",JSON.
    stringify(transactions));
  }
}


const Transaction ={
  //refatorando as transactions ou seja melhando que ja ta funcionad
  // nesse caso estamos expandido a aplicação
  all:Storage.get (),

  //adicionar transaction
  add(transaction){

   Transaction.all.push(transaction);

   App.reload()

  },
  remove(index){
    //esperando a posição do array 0,1...
    Transaction.all.splice(index,1);
    
    //removendo da o elemento ta tela
    App.reload()

  },

  incomes(){
    let income =0;
    //pegar todas as Transações
    //para cada transação
    Transaction.all.forEach(transaction => {
      //se ela for maior que zero
       if (transaction.amount > 0 ){
         //somar a uma variavel e retornar a variavel
        income += transaction.amount;
       }
    })

    return income;
  },
  expenses(){
    let expense =0;
    Transaction.all.forEach(transaction => {
       if (transaction.amount < 0 ){
        expense += transaction.amount;
       }
    })
    return expense;
  },
  total(){
    return Transaction.incomes() + Transaction.expenses();
  }
}

const DOM = {
  //contem as entradas de dados
    transactionsContainer : document.querySelector('#data-table tbody'),

      addTransaction(transaction,index) {
          const tr = document.createElement('tr')

          //recebe o html do metodo innerHTMLTransaction
          //função innerHTML o innerHTML retorna todo o texto e o html que existem no elemento
          tr.innerHTML = DOM.innerHTMLTransaction(transaction,index)

          tr.dataset.index =index

          //adiciona um novo elemento ao DOM
          DOM.transactionsContainer.appendChild(tr)
      },

  innerHTMLTransaction(transaction,index) {
    const CSSclass = transaction.amount > 0 ? "income": "expense";

    const amount = Utils.formatCurrency(transaction.amount);


// criando uma estrutura
    const html =`
        <td class="descripcion">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date"> ${transaction.date}</td>
        <td>
            <img onclick ="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>
    `

    return html
  },
  updateBalance(){
    document
    //pegando o valor de entradas
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency (Transaction.incomes())

    //pegando o valor de saidas
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency (Transaction.expenses())

    //pegando o valor total
    document
      .getElementById('totalDisplay')
      .innerHTML =Utils.formatCurrency (Transaction.total())
  },
  //limpando as Transações
  clearTransaction(){
    DOM.transactionsContainer.innerHTML= ""
  }
}

const Utils = {
  //
  formatAmount(value){
    value = Number(value) * 100
    return Math.round(value)
  },

  //formantando  a data
  formatDate(date){
     const splittedDate = date.split("-")
     return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  } ,

  //formatando a moeda
  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" :""
   
    //trocando o conteudo 
   value = String(value).replace(/\D/g, "");

   value = Number(value)/100

   value = value.toLocaleString("pt-BR",{
     style :"currency",
     currency:"BRL"
   })
   
    return signal+value
   
  }

}

const Form = {
  //pegando todo o elemento do input
    description : document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date : document.querySelector('input#date'),

    //pegando os valores
    getValues(){
      return {
          description: Form.description.value,
          amount: Form.amount.value,
          date: Form.date.value
      }

    },
    validateFields(){
      //tirando os elementos e guardando dentro de uma variavel
     const { description , amount , date } = Form.getValues()

     //verificando se os elementos estão vazio
     //trin -> limpeza dos espaços vazios na string
     // se string for vazio ou vazio ou vazio
     if ( description.trim() === "" || 
         amount.trim() === "" ||
         date.trim() === "" ) {
          throw new Error (" Por favor, preencha todos os campos")
     }
    } ,
    formatValues(){
         //tirando os elementos e guardando dentro de uma variavel
     let { description , amount , date } = Form.getValues()

     amount = Utils.formatAmount(amount)

      date = Utils.formatDate(date)

      return{
        description ,
        amount,
        date
      }
      
    },
   
    clearFields(){
      //Limpando os campos
      Form.description.value =""
      Form.amount.value =""
      Form.date.value =""
    },
   
    submit(event){
     //não faz o comportamento padrão
    event.preventDefault()

    //(try), e especifica uma resposta, caso uma exceção seja lançada.
    try {

    //verificar se todas as informações foram preenchidas
    Form.validateFields()

    // formatar os dados para salvar 
     const transaction = Form.formatValues()

    //salvar
      Transaction.add(transaction)

    //apagar os dados do formulario 
    Form.clearFields()

    //modal feche
    Modal.close()
    }
    // catch -> captura o erro
    catch (error) { 
      alert(error.message)
    } 
  }
}


const App = {
  init(){
    
//manipulação dos elementos de um array.
Transaction.all.forEach((transaction , index) =>{
  DOM.addTransaction(transaction , index);
})

//chamando o updateBalance
DOM.updateBalance()

//atualizando o localStorage
Storage.set(Transaction.all)

  },
  reload(){
    DOM.clearTransaction()
    App.init()
  },
}
App.init()


