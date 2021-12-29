let cart = []
let modalQtd = 1
let modalKey = 0



const c = el => document.querySelector(el)

const cs = el => document.querySelectorAll(el)


// Listagem das pizzas
pizzaJson.map((item, index) =>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // Preencher as informações em pizzaItem

    pizzaItem.setAttribute('data-key', index)

    
    pizzaItem.querySelector(".pizza-item--img img").src = item.img
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`

    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description
    pizzaItem.querySelector('a').addEventListener('click', (e)=> {



        e.preventDefault() // função para cancelar o evento padrão 

        modalQtd = 1

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        
        modalKey = key

        c(".pizzaInfo h1").innerHTML = pizzaJson[key].name
        c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description
        c(".pizzaBig img").src = pizzaJson[key].img
        c(".pizzaInfo--actualPrice").innerHTML = ` R$ ${pizzaJson[key].price.toFixed(2)}`
        c(".pizzaInfo--size.selected").classList.remove('selected')
        cs(".pizzaInfo--size").forEach((size, sizeIndex) => {

            if(sizeIndex == 2) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]

        })

        c(".pizzaInfo--qt").innerHTML = modalQtd

        c('.pizzaWindowArea').style.opacity = '0'
        c('.pizzaWindowArea').style.display = 'flex'

        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = '1'
        })
    })



    c('.pizza-area').append(pizzaItem)

    

})


// Eventos do modal 

function closeModal(){

    c('.pizzaWindowArea').style.opacity = '0'
    setTimeout(() => {
    
    c('.pizzaWindowArea').style.display = 'none'

    },500)

}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})



    c('.pizzaInfo--qtmenos').addEventListener('click', () => {

        if (modalQtd > 1) {
            
            modalQtd = modalQtd - 1
            c('.pizzaInfo--qt').innerHTML = modalQtd
        }
    })

    c('.pizzaInfo--qtmais').addEventListener('click', () => {

        modalQtd = modalQtd+1

        c('.pizzaInfo--qt').innerHTML = modalQtd

    })

    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {

        size.addEventListener('click', (e) => {
            c('.pizzaInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')
            
        })

    })
// Adicionando ao carrinho
    c('.pizzaInfo--addButton').addEventListener('click', () => {

        let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))


        let identifier =  pizzaJson[modalKey].id + "@" + size // isso representa o id mais o tamanho 

        let key = cart.findIndex((item) => {
            return item.identifier == identifier
        })

        if ( key > -1) {
            cart[key].qtd += modalQtd
        }else {
            cart.push({
                identifier,
                id: pizzaJson[modalKey].id,
                size: size,
                qtd: modalQtd
            })
        }

        updateCart()

        closeModal()
        


        // a mesma pizza do memso tamanho tem que ficar junto, só se for tamanho diferente a gente separa


        
        // // Qual a pizza?
        // console.log ("Pizza: " + modalKey)
        // // Qual o tamanho ?
        // let size = c('.pizzaInfo--size.selected').getAttribute('data-key')
        // console.log("Tamanho: " + size)
        
        // // Quantas pizzas?
        // console.log("Quantidade: " + modalQtd)
    })

    c('.menu-openner').addEventListener('click', () => {
        
        if(cart.length >= 1){
        c('aside').style.left = '0'
        }
    })

    c('.menu-closer').addEventListener('click', () => {
        c('aside').style.left = '100vw'
    })

    function updateCart() {

        c('.menu-openner span').innerHTML  = cart.length;

        if (cart.length > 0) {
            c('aside').classList.add('show') // seleciona a area do carrinho e mostra ela
             c('.cart').innerHTML = ''

             let subtotal = 0
             let desconto = 0
             let total = 0

            for ( let i in cart) {

                let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)


                subtotal += pizzaItem.price * cart[i].qtd

                let cartItem = c('.models .cart--item').cloneNode(true)

                let pizzaSizeName

                switch (cart[i].size){
                    case 0:
                    pizzaSizeName = 'P'
                        break
                    case 1: 
                    pizzaSizeName = 'M'
                        break
                    case 2: 
                    pizzaSizeName = 'G'
                        break;
                } 

                let pizzaName = `${pizzaItem.name} (${pizzaSizeName}) `

                cartItem.querySelector('img').src = pizzaItem.img
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qtd

                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                    if (cart[i].qtd > 1){
                        cart[i].qtd--
                    }else {
                        cart.splice(i, 1)
                    }

                    updateCart()
                })
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                    cart[i].qtd++;
                    updateCart()
                })

                c('.cart').append(cartItem);
              

            }
                desconto = subtotal * 0.1
                total = subtotal - desconto 

                c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
                c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
                c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
                
        } else {
            c('aside').classList.remove('show')
            c('aside').style.left = '100vw'
        }
    }