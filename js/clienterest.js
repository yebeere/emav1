/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

        // decodifica el JSONP
        var $jsonp = (function(){
                var that = {};
                that.send = function(src, options) {
                  var callback_name = options.callbackName || 'callback',
                    on_success = options.onSuccess || function(){},
                    on_timeout = options.onTimeout || function(){},
                    timeout = options.timeout || 10; // sec
                  var timeout_trigger = window.setTimeout(function(){
                    window[callback_name] = function(){};
                    on_timeout();
                  }, timeout * 1000);
                  window[callback_name] = function(data){
                    window.clearTimeout(timeout_trigger);
                    on_success(data);
                  }

                  var script = document.createElement('script');
                  script.type = 'text/javascript';
                  script.async = true;
                  script.src = src;

                  document.getElementsByTagName('head')[0].appendChild(script);
                }

                return that;
              })();

            /* función que envía la solicitud de parametros al servidor*/
            

            
      /*      function retornaDatosEma() {
                var ema=document.getElementById('comboemas').options[document.getElementById('comboemas').selectedIndex].value; 
                var URL = 'http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema+'?callback=handleStuff';
                xmlHttp.open("GET", URL, false); //true mean call is asynchronous
                xmlHttp.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
                xmlHttp.send(null);
                $jsonp.send('http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema+'?callback=handleStuff', {
                //$jsonp.send('http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema+'?callback=handleStuff', {
                        callbackName: 'handleStuff',
                        onSuccess: function(json){
                        //console.log('success!', json);
                        if (json.error!="Hay problemas con la EMA"){
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
                    timeout: 5
                });
               setTimeout(retornaDatosEma,2*60*1000);
               //window.setInterval(retornaDatosEma, 2*60*1000);
            }
*/