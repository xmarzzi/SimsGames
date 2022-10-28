

/* CARRITO */
document.addEventListener("DOMContentLoaded", () => {
  fetchData()
})

const fetchData = async () => {
  try{
      const res = await fetch('/packexpansion.json')
      const data = await res.json()
      pintarProductos(data)
      detectarBotones(data)
  } catch (error) {
      console.log(error)
  }
}

const contenedorProductos = document.querySelector('#contenedorProductos')
const contenedor = document.querySelector('#contenedor')
const pintarProductos = (data) => {
  const template = document.querySelector('#templateProductos').content
  const fragment = document.createDocumentFragment()
  data.forEach(producto => {
      template.querySelector('img').setAttribute('src', producto.img)
      template.querySelector('h5').textContent = producto.title
      template.querySelector('p').textContent = producto.description
      template.querySelector('p span').textContent = producto.price
      template.querySelector('button').dataset.id = producto.id
      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
  })
  contenedorProductos.appendChild(fragment)
};


let carrito = {}

let carritoStorage = JSON.parse(localStorage.getItem("carrito"));
let guardarCarrito = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito)); 
}

const detectarBotones = (data) => {
  const botones = document.querySelectorAll('.card button')
  botones.forEach(btn =>{
      btn.addEventListener('click', () =>{
          const producto = data.find(item => item.id === parseInt(btn.dataset.id))
          producto.cantidad = 1
          if(carrito.hasOwnProperty(producto.id)){
              producto.cantidad = carrito [producto.id].cantidad + 1
          };
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Producto agregado al carrito',
            showConfirmButton: false,
            timer: 1500
          }) 
          carrito[producto.id] = {...producto}
          pintarCarrito();
      })
  })
}
const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll('#items .btn-info')
  const botonesEliminar = document.querySelectorAll('#items .btn-danger')
  botonesAgregar.forEach(btn =>(
      btn.addEventListener('click', () =>{
          const producto = carrito[btn.dataset.id]
          producto.cantidad ++
          carrito[btn.dataset.id] = {...producto}
          pintarCarrito ();
          guardarCarrito ();
      })
      
  )
  )
  
  botonesEliminar.forEach(btn =>(
      btn.addEventListener('click', () =>{
          const producto = carrito[btn.dataset.id]
          producto.cantidad--

          producto.cantidad === 0 ? (delete carrito [btn.dataset.id]) : (carrito[btn.dataset.id] = {...producto})
          pintarCarrito ();
          guardarCarrito ();
      })
  ))
}

const items = document.querySelector('#items')
const pintarCarrito = () =>{
  
  items.innerHTML = ''

  const template = document.querySelector('#template-carrito').content
  const fragment = document.createDocumentFragment()

  Object.values(carrito).forEach(producto =>{
      template.querySelector('th').textContent = producto.id
      template.querySelectorAll('td')[0].textContent = producto.title
      template.querySelectorAll('td')[1].textContent = producto.cantidad
      template.querySelector('span').textContent = producto.price * producto.cantidad

      //botones
      template.querySelector('.btn-info').dataset.id = producto.id
      template.querySelector('.btn-danger').dataset.id = producto.id

      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
  })
      items.appendChild(fragment)
      pintarFooter()
      accionBotones()
      guardarCarrito()
}

const footer = document.querySelector('#footer-carrito')
const pintarFooter = () =>{
  footer.innerHTML = ''

  if(Object.keys(carrito).length === 0) {
      footer.innerHTML = '<th scope="row" colspan="5"> Carrito vacío! </th>'
      return
  }

  const template = document.querySelector('#template-footer').content
  const fragment = document.createDocumentFragment()

  //sumar cantidad y sumar totales
  const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad, 0)
  const nTotal = Object.values(carrito).reduce((acc, {cantidad,price})=> acc + cantidad * price, 0)
 
  template.querySelectorAll('td')[0].textContent = nCantidad
  template.querySelector('span').textContent = nTotal

  const clone = template.cloneNode(true)
  fragment.appendChild(clone)
  footer.appendChild(fragment)

  const boton = document.querySelector('#vaciar-carrito')
  boton.addEventListener('click', () =>{
      Swal.fire({
        title: 'Está seguro de eliminar el carrito?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar!'
      }).then((result) => {
        result.isConfirmed ? (carrito = {}, pintarCarrito(), pintarFooter(), localStorage.clear(), Swal.fire('Elimiando!', 'Tu carrito ha sido elimiando.', 'success') ) : ("");
      })
  })
 
}

carritoStorage ? (carrito = carritoStorage, pintarCarrito(), pintarFooter()) : ("");

