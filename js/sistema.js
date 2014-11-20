/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
    var ema= new Array();
    var ls=false;
    var li=false;
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



var onSuccessGPS  = function(position) {
                   hayGPS=true;
                   document.getElementById('gps').className = 'estado ok';
                    var latitud = position.coords.latitude;
                    var longitud = position.coords.longitude;
                    var precision = position.coords.accuracy;
                   //solicita el listado de EMAs al WebServer por JSONP
                   $.ajax({
                                url: 'http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff',
                                type: "GET",
                                dataType: "jsonp",
                                success: function(json){
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
                                    for (var j = 0; j < cantidad; j++) { 
                                       //var j=i;
                                      $("<option value='"+j+"'>"+ema[j][0]+" (Dist:"+Math.round(ema[j][5]) +" km) </option>").appendTo("#comboemas");
//                                      var myselect = $("#comboemas");
//                                      myselect.selectmenu('refresh');
                                    }

                                    $("#comboemas option[value=0]").attr("selected",true);
                                    var myselect = $("#comboemas");
                                    myselect.selectmenu('refresh');
                            }
                        });
           
    }

    function onErrorGPS() {
                        hayGPS=false;
                        document.getElementById('gps').className = 'estado no';
                        
                         $.ajax({
                                url: 'http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff',
                                type: "GET",
                                dataType: "jsonp",
                                success: function(json){
                                   
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
                                    }
                                });
                        
    }
    function verDatosEMA(){
                 var mobile = detectmobile(navigator.userAgent||navigator.vendor||window.opera);  
                if( mobile == true ){
                         alert("Es movil!");
                        pantalla();//
                   }
                var e = document.getElementById("comboemas");
                var emaSeleccionada = e.options[e.selectedIndex].value;
                if (emaSeleccionada==='Estaciones Meteorológicas') {emaSeleccionada=0;}

                     $.ajax({
                                url: 'http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=rr',
                                type: "GET",
                                dataType: "jsonp",
                                success: function(json){
                      
                      
                        if (json.error==""){
                                //alert(json.error);
                                var datosEMA=json;
                               
                                weather = {};
                                units='C';
                                
                                
                                moment.locale('es');
                                fecha1 ='20'+moment(datosEMA.fecha,['DD/MM/YY','D/MM/YY']).format('YY-MM-DD')+' '+datosEMA.hora;;
                                //console.log('ti='+fecha1);
                                fecha2=moment(fecha1).format('DD/MM/YYYY HH:mm');
                                //console.log('t='+fecha1);
                                html = '<ul><li id="ema"  class="currently"><h3>'+datosEMA.estacion+'</h3></li></ul>';
                                html += '<h2>'+datosEMA.temperatura+'&deg;'+units+'</h2>';
                                html += '<ul><li><b>Datos de fecha: </b>'+moment(fecha1).format('DD/MM/YYYY HH:mm')+'</li>';
                                html += '<ul><br /><li><b>Humedad:</b>'+datosEMA.humedad+' %'+'</li>&nbsp;';
                                html += '<li><b>Presion:</b>'+datosEMA.presion+' mBar'+'</li></ul>';
                                html += '</ul><br /><ul><li><b>Viento:</b>'+datosEMA.viento+' km/h'+'</li>&nbsp;<li>'+datosEMA.dirViento+'</li></ul>';
                                html += '</ul><br /><ul><li><b>Ráfagas:</b>'+datosEMA.rafagas+' km/h'+'</li>&nbsp;<li><b>Lluvia:</b>'+datosEMA.lluvia+' mm'+'</ul>';
                                //datosEMA.fecha=moment(datosEMA.fecha,"YY-MM-DD");


                                 //fecha='20'+datosEMA.fecha+' '+datosEMA.hora;
                                 var timestamp = moment(fecha2,'DD-MM-YYYY HH:mm');

                                 html += '<p>Actualizado '+moment(timestamp).fromNow()+'</p>';


                                $("#weather").html(html);                                
                                
                                limitesuperior=document.getElementById("limitesuperior").value;
                                limiteinferior=document.getElementById("limiteinferior").value;
                                if (parseFloat(datosEMA.temperatura) > limitesuperior) {
                                    
                                   $('#clima').delay(1500).css('background-color', '#F7AC57');
                                   $('#weather h2').css('color','#fff');
                                    //document.getElementById('ema').style.color = '#fff';
                                     navigator.notification.vibrate(1000);
                                     if ($('#sonido').value=='si')
                                          {if (ls==false) { navigator.notification.beep(1);   }}
                                     ls=true;
                                       //animate({backgroundColor: '#F7AC57'}, 1500);
                                 } else {
                                     if (parseFloat(datosEMA.temperatura) < limiteinferior){
                                        $('#clima').delay(1500).css('background-color', '#0091c2');
                                        $('#weather h2').css('color','#fff');
                                        //document.getElementById('ema').style.color = '#fff';
                                            //animate({backgroundColor: '#0091c2'}, 1500);
                                           navigator.notification.vibrate(1000);
                                           if ($('#sonido').value=='si')
                                                {if (li==false) { navigator.notification.beep(1);   }}
                                            li=true;
                                           
                                     }
                                     else {
                                         $('#clima').delay(1500).css('background-color', '#84FF8E');
                                         $('#weather h2').css('color','#000');
                                         //document.getElementById('ema').style.color = '#000000';
                                         //$("#weather h2").css("textcolor", "black");
                                             //animate({backgroundColor: '#84FF8E'}, 1500);
                                     }
                                 }
                                
                        } else {
                                
                                error='<ul><li id="ema" ><p>Problemas con la Estacion</p></li></ul>';
                                $("#weather").html('<p>'+error+'</p>');
                              }
                        }   
                });
          }
    function datos(){
              $.ajaxSetup({ cache:false });
              verDatosEMA();
              setTimeout(datos,2*60*1000);
              window.cache.clear();
              navigator.app.clearCache();
        
    }
    function pantalla(){
              if ($('#apagado').value=='no'){
                  alert("No apaga la pantalla");
                   window.plugins.insomnia.keepAwake();// plugin de PhoneGAP para dejar la pantalla encendida (cargado en config.xml)
              } else {
                   window.plugins.insomnia.allowSleepAgain();// volver a permitir apagado de pantalla
              }
    }
    
    function detectmobile(a){  
        var mobile = false;  
        if(/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))){  
          mobile = true;  
        }  
        return mobile;  
      };  
