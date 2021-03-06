/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var stompClient = null;
var x = 0;
var y = 0;
var canvas;
var context;
var canvasLimites; // los margenes del canvas
var flagPaint = false; // nos dice si pintar o no
var actualPos; // la posición actual donde hice click

prepareCanvas = function () {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d"); // obtenemos el contexto ( dibujar en 2d)
    canvasLimites = canvas.getBoundingClientRect(); // obtenemos los limites del canvas
    ctx.lineWidth = 1;
            if(Math.random()==0){
                context.strokeStyle = '#3B83BD';
            }else{
                context.strokeStyle = '#CC0605';
            }
    canvas.addEventListener('mousedown', cambiarEstado, false);
    canvas.addEventListener('mouseup', cambiarEstado, false);
    canvas.addEventListener('mousemove', pintarLinea, false);

    canvas.style.cursor = "hand";


};

cambiarEstado = function () {
    flagPaint = !flagPaint;
    actualPos = obtenerCoordenadas(event);
};

irClase = function () {
    location.href = "ClaseE.html";
};
pintarLinea = function (event) {
    if (flagPaint) {
        var coordenadas = obtenerCoordenadas(event);
        ctx.beginPath(); // comenzamos a dibujar
        ctx.moveTo(actualPos.x, actualPos.y); // ubicamos el cursor en la posicion (10,10)
        ctx.lineTo(coordenadas.x, coordenadas.y);
        actualPos = {
            x: coordenadas.x,
            y: coordenadas.y
        };
            if(Math.random()==0){
                context.strokeStyle = '#3B83BD';
            }else{
                context.strokeStyle = '#CC0605';
            } // color de la linea
        ctx.stroke(); // dibujamos la linea
    }
};
obtenerCoordenadas = function (event) {
    var posX;
    var posY;

    if (event.pageX || event.pageY) {
        posX = event.pageX - canvasLimites.left;
        posY = event.pageY - canvasLimites.top;
    } else {
        posX = event.clientX - canvasLimites.left;
        posY = event.clientY - canvasLimites.top;
    }

    return {x: posX,
        y: posY
    };
};

erase = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
};
erase1 = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function connect() {
    var socket = new SockJS('/stompendpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        //console.log("Ya tengo los datossssssssssssssssssssssssssssssssssss");

        clase = sessionStorage.getItem("clase");




        stompClient.subscribe('/topic/newdibujo.' + clase, function (data) {
            console.log("newdibujo");
            theObject = JSON.parse(data.body);
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(theObject["x"], theObject["y"], 1, 0, 2 * Math.PI);

            ctx.stroke();


        });
    });
}
sendPoint = function () {

    clase = sessionStorage.getItem("clase");

    stompClient.send("/app/newdibujo." + clase, {}, JSON.stringify({x: x, y: y}));
};

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


description = function () {

    clase = sessionStorage.getItem("clase");
    $.get("/Usuario/getClases", function (data) {

        for (x in data) {


            if (data[x].NombreClase == clase) {
                alert(data[x].DescripcionClase);
            }
        }
    });
};

hc = function () {
    flagPaint = !flagPaint;
};

nc = function () {
    flagPaint = !flagPaint;
};

VerEstudiantes = function () {

    clase = sessionStorage.getItem("clase");
    $.get("/Usuario/getClases", function (data) {
        var estu = [];
        for (x in data) {
            if (data[x].NombreClase == clase) {
                for (index in data[x].Estudiantes) {
                    estu = estu + data[x].Estudiantes[index] + "\n";
                }

            }
        }
        alert("Estudiantes Inscritos en esta materia\n\n" + estu);
    });

};

$(document).ready(
        function () {
            connect();
            console.info('connecting to websockets');
            canvas = document.getElementById('myCanvas');
            context = canvas.getContext('2d');
            if(Math.random()==1){
                context.strokeStyle = '#3B83BD';
            }else{
                context.strokeStyle = '#CC0605';
            }

            context.lineWidth = 1;
            canvas.addEventListener('mousedown', hc, false);
            canvas.addEventListener('mouseup', nc, false);
            canvas.addEventListener('mousemove', function (evt) {
                if (flagPaint == false) {

                } else {
                    var mousePos = getMousePos(canvas, evt);
                    x = mousePos.x;
                    y = mousePos.y;
                    sendPoint();

                    //stompClient.send("/app/newpoint", {}, JSON.stringify({x: x, y: y}));
                    var mensaje = 'Position' + mousePos.x + mousePos.y;
                }
            }, false);

        }
);
