const db = firebase.firestore();

const taskForm = document.getElementById('imp-catalogo');
const taskContainer = document.getElementById('imp-catalogo');


let carritoOn = false;
let editStatus = false;
let id = '';
let idCliente = 'fkGyA6cAf53siIWITwQC';
let idCarritoComprar = idCliente +'1';
//Funcion para guardar la informacion en la base de datos
const saveIntegrantes = (nombre_prod, desc_prod, cant_prod, prec_prod, cond_prod, url_prod, calif_prod, cat_prod) =>
    //Creará la coleccion de la base de datos en Firebase
    //aquí se pondrá el nombre de cada entidad(si no existe, Firebase la creará en automático)
    db.collection('producto').doc().set({
        nombre_prod,
        desc_prod,
        cant_prod,
        prec_prod,
        cond_prod,
        url_prod,
        calif_prod,
        cat_prod
    })

//Funcion para imprimir la informacion
const getIntegrantes = () => db.collection('producto').get();
const getProducto = (id) => db.collection('producto').doc(id).get();
const addCarrito = (idCarritoProd,idCliente,infoProducto) => db.collection('carrito').doc(idCarritoProd).set({idCliente,infoProducto });
const onGetIntegrantes = (callback) => db.collection('producto').onSnapshot(callback);
const deleteIntegrante = (id) => db.collection('producto').doc(id).delete();
const editIntegrante = (id) => db.collection('producto').doc(id).get();
const updateIntegrante = (id, updatedIntegrante) => db.collection('producto').doc(id).update(updatedIntegrante);

//Pagina ver producto
const onGetVerIdProducto = (callback) => db.collection('ver_Producto').onSnapshot(callback);
const onGetProductos = (id) => db.collection('producto').doc(id).get();



const addVerProducto = (idProducto, datosProducto, precioProducto) => db.collection('ver_Producto').doc().set({ idProducto, datosProducto, precioProducto });

//Imprimir
window.addEventListener('DOMContentLoaded', async (e) => {

    onGetIntegrantes((querySnapshot) => {
        //Borra el contenido anterior dentro del div
        taskContainer.innerHTML = '';
        const datosProducto = [];
        //Imprimimos los datos guardados en FireBase en la consola
        querySnapshot.forEach(doc => {
            
            const infoDato = doc.data()
            infoDato.id = doc.id;
            //console.log(infoDato);
            //Genera un html
            taskContainer.innerHTML += '<div class="col-12 col-md-6 col-lg-4"><div class="clean-product-item"><div class="product-name"><a href="#">' + infoDato.nombre_prod + '</a></div>' +
                '<div class="image"><a><img class="img-fluid d-block mx-auto" src="' + infoDato.url_prod + '"></a></div>' +
                '<div class="product-name"><a>' + infoDato.desc_prod + ' ID:' + infoDato.id + '</a></div><div class="product-name"></div><div class="about"><div class="d-none rating"><img src="assets/img/star.svg"><img src="assets/img/star.svg"><img src="assets/img/star.svg"><img src="assets/img/star-half-empty.svg"><img src="assets/img/star-empty.svg"></div>' +
                '<div class="price"><h3>$' + infoDato.prec_prod + '</h3></div>' +
                '</div><div class="d-flex justify-content-around product-name" style="margin-top: 30px;">' +
                '<button data-id="' + infoDato.id + '" class="btn btn-primary btn-desc" type="button" style="background: rgb(13,136,208);">Ver</button><button data-id="' + infoDato.id + '"class="btn btn-primary btn-add" type="button" style="background: rgb(13,136,208);">Comprar</button></div></div></div>';

            const btnDelete = document.querySelectorAll('.btn-delete');
            //console.log(btnDelete)
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    console.log(e.target.dataset.id)
                    await deleteIntegrante(e.target.dataset.id);
                })
            })

            const btnAdd = document.querySelectorAll('.btn-add');

            btnAdd.forEach(btn => {

                btn.addEventListener('click', async (e) => {
                    const doc = await getProducto(e.target.dataset.id);
                    const datoActualizar = doc.data();
                    console.log(e.target.dataset.id)
                    const idProducto = e.target.dataset.id
                    var cant_prod_car = 1;
                    datoActualizar.id = doc.id;
                    
                    datosProducto.push({
                        nombre_prod : datoActualizar.nombre_prod,
                        desc_prod : datoActualizar.desc_prod,
                        cant_prod : datoActualizar.cant_prod,
                        prec_prod : datoActualizar.prec_prod,
                        cond_prod : datoActualizar.cond_prod,
                        url_prod : datoActualizar.url_prod,
                        calif_prod : datoActualizar.calif_prod,
                        cat_prod : datoActualizar.cat_prod,
                        id_prod : idProducto,
                        cant_prod_car: cant_prod_car
                    })
                    
                    await addCarrito(idCarritoComprar,idCliente,datosProducto);
                })
            })

            const btnDesc = document.querySelectorAll('.btn-desc');

            //Vamos  la vista Descripcion del producto
            btnDesc.forEach(btn => {

                btn.addEventListener('click', async (e) => {

                    const doc = await getProducto(e.target.dataset.id);
                    const datoVer = doc.data();
                    //console.log(e.target.dataset.id)
                    const idProducto = e.target.dataset.id
                    const precioProducto = datoVer.prec_prod
                    const datosProducto = [{
                        nom_prod: datoVer.nombre_prod,
                        desc_prod: datoVer.desc_prod,
                        cantidad_prod: datoVer.cant_prod,
                        estado_prod: datoVer.cond_prod,
                        foto_prod: datoVer.url_prod,
                        rate_prod: datoVer.calif_prod,
                        categoria_prod: datoVer.cat_prod,
                    }];
                    await addVerProducto(idProducto, datosProducto, precioProducto);
                    function redireccionar() { location.href = "descripcionProducto.html"; }
                    setTimeout(redireccionar(), 25000);
                })
            })

            const btnEdit = document.querySelectorAll('.btn-edit');
            btnEdit.forEach(btn => {

                btn.addEventListener('click', async (e) => {
                    const doc = await getProducto(e.target.dataset.id);
                    const datoActualizar = doc.data();

                    editStatus = true;
                    //Obtenemos el id del producto
                    id = doc.id;
                    taskForm['nombre_producto'].value = datoActualizar.nombre_prod;
                    taskForm['desc_producto'].value = datoActualizar.desc_prod;
                    taskForm['cantidad_producto'].value = datoActualizar.cant_prod;
                    taskForm['precio_producto'].value = datoActualizar.prec_prod;
                    taskForm['condicion_producto'].value = datoActualizar.cond_prod;
                    taskForm['foto_producto'].value = datoActualizar.url_prod;
                    taskForm['calif_producto'].value = datoActualizar.calif_prod
                    taskForm['categoria_producto'].value = datoActualizar.cat_prod;
                    //Boton de actualizar info (No Tocar)
                    taskForm['subir_registro'].innerText = 'Update';
                })
            })
            console.log(infoDato.id)
        })

    })

});

//Estructura de la informacion que se guardará a la base de datos
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Nombre de variable = nombre de la variable que guarda el id del div a editar['Nombre del id especifico a editar'].value;

    const nombre_prod = taskForm['nombre_producto'].value;
    const desc_prod = taskForm['desc_producto'].value;
    const cant_prod = Number(taskForm['cantidad_producto'].value);
    const prec_prod = Number(taskForm['precio_producto'].value);
    const cond_prod = taskForm['condicion_producto'].value;
    const url_prod = taskForm['foto_producto'].value;
    const calif_prod = Number(taskForm['calif_producto'].value);
    const cat_prod = taskForm['categoria_producto'].value;

    if (!editStatus) {
        await saveIntegrantes(nombre_prod, desc_prod, cant_prod, prec_prod, cond_prod, url_prod, calif_prod, cat_prod);
    } else {

        await updateIntegrante(id, {
            nombre_prod,
            desc_prod,
            cant_prod,
            prec_prod,
            cond_prod,
            url_prod,
            calif_prod,
            cat_prod
        });
        editStatus = false;

        //Boton de Guardar info (No tocar)
        taskForm['subir_registro'].innerText = 'Guardar';

    }
    console.log(id)
    getIntegrantes();
    taskForm.reset();
    //console.log(url_foto, nombre_integrante);
})