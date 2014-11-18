/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
    var ema= new Array();
    function isOffline() {
                     //  alert ('Su dispositivo móvil esta fuera de línea');
                       document.getElementById('net').className = 'estado no'; //pone la cruz roja de sin red
                       //carga los datos de evaporacion media segun tabla
                       hayRed=false;
                       
                   }
    function isOnline() {
        //    alert ('Su dispositivo móvil esta en línea');
            document.getElementById('net').className = 'estado ok'; //pone el tilde verde
            //parametriza los valores del GPS
            var options = {maximumAge: 100, timeout: 50000, enableHighAccuracy:true};
            hayRed=true;
            //Accede a la geolocalizacion por GPS o Red
            navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS, options);
           // buscardatosHistoricos();
        }
function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
//	if (d>1) return Math.round(d)+"km";
//	else if (d<=1) return Math.round(d*1000)+"m";
	return d;
}

var menorDistancia= new Array(7);
function ordenGPS(position){
       // calculo la distancia de c/u de las EMA y lo guardo en MenorDistancia
       for (var i = 0; i < 7; i++) {
                //
                ema[i][5] = distance(ema[i][1],ema[i][2],-38.57,-68.36);
                //ema[i][5] = distance(ema[i][1],ema[i][2],position.coords.latitude,position.coords.longitude);
       }
        ema.sort(function(a,b) {
                            return a[5]- b[5];
                });
//       for (var i = 0; i < 7; i++) {         
//         $("<option value='"+(i+1)+"'>"+ema[i][0]+"</option>").appendTo("#esta"); 
//       }
       //$("#esta option[value=1]").attr("selected",true);

       document.getElementById('estaciones').innerHTML = ema;         
}


var onSuccessGPS  = function(position) {
                   hayGPS=true;
                   document.getElementById('gps').className = 'estado ok';
                    var latitud = position.coords.latitude;
                    var longitud = position.coords.longitude;
                    var precision = position.coords.accuracy;
                   //solicita el listado de EMAs al WebServer por JSONP
            	   $jsonp.send(' http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff', {
                            callbackName: 'handleStuff',
                            onSuccess: function(json){
                                    var datosEMA=json;
                                    cantidad=datosEMA.length;
                                    texto="";
                                    var i;
                                    for (i=0;i<cantidad;i++) {
                                        ema.push([datosEMA[i].nombreEma,datosEMA[i].latitudEma,datosEMA[i].longitudEma,datosEMA[i].altitudEma,datosEMA[i].codigoEma,
                                            distance(datosEMA[i].latitudEma,datosEMA[i].longitudEma,latitud,longitud)]);

                                     }
                                    // ordena por menor distancia
                                    ema.sort(function(a,b) {
                                                    return a[5]- b[5];
                                        });
                                    //asigna
                                    for (var i = 0; i < cantidad; i++) { 
                                       //var j=i;
                                      $("<option value='"+i+"'>"+ema[i][0]+" (Dist:"+Math.round(ema[i][5]) +" km) </option>").appendTo("#comboemas");
                                      var myselect = $("#comboemas");
                                      myselect.selectmenu('refresh');
                                    }

                                    $("#comboemas option[value=0]").attr("selected",true);
                                    var myselect = $("#comboemas");
                                    myselect.selectmenu('refresh');
                            },
                            onTimeout: function(){
                                //console.log('timeout!');
                                    var option = document.createElement("option");
                                    option.text ="Hay problemas";
                                    option.value = 0;
                                    var select = document.getElementById("comboemas");
                                    select.appendChild(option);
                            },
                            timeout: 1000
                        });
           
    }

    function onErrorGPS() {
                        hayGPS=false;
                        document.getElementById('gps').className = 'estado no';
                        
                        $jsonp.send(' http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff', {
                            callbackName: 'handleStuff',
                            onSuccess: function(json){
                                   
                                    var datosEMA=json;
                                    var cantidad=datosEMA.length;
                                    texto="";
                                    var i;
                                    for (i=0;i<cantidad;i++) {
                                        ema.push([datosEMA[i].nombreEma,datosEMA[i].latitudEma,datosEMA[i].longitudEma,datosEMA[i].altitudEma,datosEMA[i].codigoEma,
                                            0]);

                                     }

                                    for (var i = 0; i < cantidad; i++) { 
                                       //var j=i;
                                       texto=  "<option value='"+i+"'>"+ema[i][0]+"</option>";
                                        //<option value="1"></option>
                                      $(texto).appendTo("#comboemas");
                                      var myselect = $("#comboemas");
                                      myselect.selectmenu('refresh');

                                    }
                                    $("#comboemas option[value=0]").attr("selected",true);
                                    var myselect = $("#comboemas");
                                    myselect.selectmenu('refresh');
                                    },
                                    onTimeout: function(){
                                        //console.log('timeout!');
                                            var option = document.createElement("option");
                                            option.text ="Hay problemas";
                                            option.value = 0;
                                            var select = document.getElementById("comboemas");
                                            select.appendChild(option);
                                    },
                                    timeout: 1000
                                });
                        
    }         function verDatosEMA(){
                var e = document.getElementById("comboemas");
                var emaSeleccionada = e.options[e.selectedIndex].value;
                if (emaSeleccionada==='Estaciones Meteorológicas') {emaSeleccionada=0;}
                //console.log(emaSeleccionada+'  #  '+ema[emaSeleccionada][4]);
              /*  
                retornaDatosEma(ema[emaSeleccionada][4],function(datosEMA){
                        //console.log(datosEMA);
                        publicarDatosEMA(emaSeleccionada,datosEMA);
                });
               */ 
                 var URL = 'http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff';
                xmlHttp.open("GET", URL, false); //true mean call is asynchronous
               xmlHttp.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
               // xmlHttp.onreadystatechange = getweatherData;
                xmlHttp.send(null);
              
                //$jsonp.send('http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff', {
                $jsonp.send('http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff', {
                        callbackName: 'handleStuff',
                        onSuccess: function(json){
                      //  console.log('http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff');
                      //  console.log('success!', json);
                        if (json.error==""){
                                //alert(json.error);
                                var datosEMA=json;
                                document.getElementById("ema").innerHTML=datosEMA.estacion;
                                document.getElementById("date").innerHTML=datosEMA.fecha;
                                document.getElementById("hour").innerHTML=datosEMA.hora;
                                document.getElementById("temperatura").innerHTML=datosEMA.temperatura+' ºC';
                                document.getElementById("humedad").innerHTML=datosEMA.humedad+' %';
                                document.getElementById("presion").innerHTML=datosEMA.presion+'mB';
                                document.getElementById("lluvia").innerHTML=datosEMA.lluvia+' mm';
                                document.getElementById("viento").innerHTML=datosEMA.viento+' km/h';
                        } else {
                                document.getElementById("ema").innerHTML="Problemas con la EMA";
                                document.getElementById("temperatura").innerHTML='Sin Datos';
                                document.getElementById("humedad").innerHTML='Sin Datos';
                                document.getElementById("presion").innerHTML='Sin Datos';
                                document.getElementById("lluvia").innerHTML='Sin Datos';
                                document.getElementById("viento").innerHTML='Sin Datos';
                              }
                        },
                                               
                        onTimeout: function(){
                            //console.log('timeout!');
                            document.getElementById("ema").innerHTML='Sin Datos';
                            document.getElementById("date").innerHTML='Sin Datos';
                            document.getElementById("temperatura").innerHTML='Sin Datos';
                            document.getElementById("humedad").innerHTML='Sin Datos';
                            document.getElementById("presion").innerHTML='Sin Datos';
                            document.getElementById("lluvia").innerHTML='Sin Datos';
                            document.getElementById("viento").innerHTML='Sin Datos';
                        },
                    timeout: 1000
                });
                
                
          }
    