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
                   //$jsonp.send(' http://localhost/yii/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff', {
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
                            timeout: 5
                        });
           
    }

    function onErrorGPS() {
                        hayGPS=false;
                        document.getElementById('gps').className = 'estado no';
                        
                         $jsonp.send(' http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff', {
                         //$jsonp.send(' http://localhost/yii/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff', {   
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
                                    timeout: 5
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
                 //var URL = 'http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff';
                   var URL = 'http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff';
               // xmlHttp.open("GET", URL, false); //true mean call is asynchronous
              //  xmlHttp.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
               // xmlHttp.send(null);
              
                $jsonp.send('http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff', {
                //$jsonp.send('http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff', {
                        callbackName: 'handleStuff',
                        onSuccess: function(json){
                      //  console.log('http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff');
                      //  console.log('success!', json);
                        if (json.error==""){
                                //alert(json.error);
                                var datosEMA=json;
                               
                                weather = {};
                                units='C';
                                limitesuperior=document.getElementById("limitesuperior").value;
                                limiteinferior=document.getElementById("limiteinferior").value;
                                if (parseFloat(datosEMA.temperatura) > limitesuperior) {
                                   $('#clima').delay(1500).css('background-color', '#F7AC57');
                                       //animate({backgroundColor: '#F7AC57'}, 1500);
                                 } else {
                                     if (parseFloat(datosEMA.temperatura) < limiteinferior){
                                        $('#clima').delay(1500).css('background-color', '#0091c2');
                                            //animate({backgroundColor: '#0091c2'}, 1500);
                                     }
                                     else {
                                         $('#clima').delay(1500).css('background-color', '#84FF8E');
                                             //animate({backgroundColor: '#84FF8E'}, 1500);
                                     }
                                 }
                                moment.locale('es');
                                fecha1 ='20'+moment(datosEMA.fecha,['DD/MM/YY','D/MM/YY']).format('YY-MM-DD')+' '+datosEMA.hora;;
                                //console.log('ti='+fecha1);
                                fecha2=moment(fecha1).format('DD/MM/YYYY HH:mm');
                                //console.log('t='+fecha1);
                                html = '<ul><li id="ema" onClick="overlay();">'+datosEMA.estacion+'</li></ul>';
                                html += '<h2>'+datosEMA.temperatura+'&deg;'+units+'</h2>';
                                html += '<ul><li>'+moment(fecha1).format('DD/MM/YYYY HH:mm')+'</li>';
                                html += '<ul><br /><li class="currently"><b>Humedad:</b>'+datosEMA.humedad+' %'+'</li></ul>';
                                html += '</ul><br /><ul><li><b>Presion:</b>'+datosEMA.presion+' mBar'+'</li></ul>';
                                html += '</ul><br /><ul><li><b>Viento:</b>'+datosEMA.viento+' km/h'+'</li><li>'+datosEMA.dirViento+'</li></ul>';
                                html += '</ul><br /><ul><li><b>Ráfagas:</b>'+datosEMA.rafagas+' km/h'+'</li></ul>';
                                //datosEMA.fecha=moment(datosEMA.fecha,"YY-MM-DD");


                                 //fecha='20'+datosEMA.fecha+' '+datosEMA.hora;
                                 var timestamp = moment(fecha2,'DD-MM-YYYY HH:mm');

                                 html += '<p>Actualizado '+moment(timestamp).fromNow()+'</p>';


                                $("#weather").html(html);                                
                                
                                
                                
                        } else {
                                
                                error='<ul><li id="ema" onClick="overlay();"><p>Problemas con la Estacion</p></li></ul>';
                                $("#weather").html('<p>'+error+'</p>');
                              }
                        },
                                               
                        onTimeout: function(){
                            //console.log('timeout!');
                            
                            error='Problemas de comunicacion';
                              $("#weather").html('<p>'+error+'</p>');
                        },
                    timeout: 5
                });
             // navigator.app.clearCache();
              setTimeout(verDatosEMA,2*60*1000);
              window.cache.clear();
          }
    