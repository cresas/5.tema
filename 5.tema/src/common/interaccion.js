function interaccionComun(bootloader)
{
    var camera = bootloader.cameras.main;
    //interaccion
    bootloader.teclas = bootloader.input.keyboard.addKeys('LEFT,UP,RIGHT,DOWN,ENTER,SPACE,CTRL,NUMPAD_ADD,NUMPAD_SUBTRACT');
    //zoom ruleta + scroll y zoom touchpad
    document.addEventListener('wheel', function(pointer) {
        if(!bootloader.isWheel)
        {
            if(!document.body.classList.contains('gmv')) {
                //if(pointer.target.nodeName == 'DIV'){
                    var view_width = document.getElementById('gCntr').clientWidth;
                    var view_height = document.getElementById('gCntr').clientHeight;
                    var oldzoom = camera.zoom;
                    var zoomHecho = (pointer.deltaY < 0 ? 1.1 : 0.9);
                    var newzoom = oldzoom * zoomHecho;

                    var prevCameraScrollX = camera.scrollX;
                    var prevCameraScrollY = camera.scrollY;

                    var valorScrollDeltaX = Math.abs(pointer.deltaX - Math.trunc(pointer.deltaX));
                    var valorScrollDeltaY = Math.abs(pointer.deltaY - Math.trunc(pointer.deltaY));

                    //zoom ruleta y touchpad
                    if(pointer.deltaY == 100 || pointer.deltaY == -100 || (valorScrollDeltaY != 0 && valorScrollDeltaY != 0.25 && valorScrollDeltaY != 0.5 && valorScrollDeltaY != 0.75))
                    {
                        if(newzoom<1.09 && newzoom>0.91){ newzoom=1; }
                        if(newzoom > 1)
                        {
                            bootloader.isWheel = true;
                            camera.zoomTo(newzoom, 0);

                            var pixels_difference_w = (view_width / oldzoom) - (view_width / newzoom);
                            var side_ratio_x = (pointer.x - (view_width / 2)) / view_width;
                            camera.scrollX += pixels_difference_w * side_ratio_x;
                            var pixels_difference_h = (view_height / oldzoom) - (view_height / newzoom);
                            var side_ratio_h = (pointer.y - (view_height / 2)) / view_height;
                            camera.scrollY += pixels_difference_h * side_ratio_h;

                            prevCameraScrollX = camera.scrollX;
                            prevCameraScrollY = camera.scrollY;

                            ajustarTotal(bootloader, newzoom, oldzoom);
                        }
                        else if(newzoom == 1)
                        {
                            bootloader.isWheel = true;
                            camera.zoomTo(newzoom, 0);

                            var pixels_difference_w = (view_width / oldzoom) - (view_width / newzoom);
                            var side_ratio_x = (pointer.x - (view_width / 2)) / view_width;
                            camera.scrollX += pixels_difference_w * side_ratio_x;
                            var pixels_difference_h = (view_height / oldzoom) - (view_height / newzoom);
                            var side_ratio_h = (pointer.y - (view_height / 2)) / view_height;
                            camera.scrollY += pixels_difference_h * side_ratio_h;

                            prevCameraScrollX = camera.scrollX;
                            prevCameraScrollY = camera.scrollY;

                            camera.scrollX = 0;
                            camera.scrollY = 0;

                            setTimeout(() => {
                                var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                                bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');

                                var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                                bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
                                
                                ajustarZoom(bootloader, newzoom);    
                            }, 25); 

                            setTimeout(() => {
                                animYoyo(bootloader);
                            }, 300);
                        }
                        else
                        {
                            bootloader.isWheel = true;
                            
                            setTimeout(() => {
                                animYoyo(bootloader);
                            }, 50);
                        }
                    }

                    //scroll touchpad
                    if((valorScrollDeltaX == 0 || valorScrollDeltaX == 0.25 || valorScrollDeltaX == 0.5 || valorScrollDeltaX == 0.75) && (valorScrollDeltaY == 0 || valorScrollDeltaY == 0.25 || valorScrollDeltaY == 0.5 || valorScrollDeltaY == 0.75) && pointer.deltaY != 100 && pointer.deltaY != -100)
                    {
                        if(camera.zoom > 1)
                        {
                            camera.scrollX += pointer.deltaX;
                            camera.scrollY += pointer.deltaY;
                            
                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            desplazamientoBasico(bootloader);
                        }    
                    }
                    if (camera.scrollX !== prevCameraScrollX || camera.scrollY !== prevCameraScrollY) 
                    {
                        prevCameraScrollX = camera.scrollX;
                        prevCameraScrollY = camera.scrollY;

                        desplazamientoTotal(bootloader);
                    } 
                //}
            }
        }
    });

    //impide zoom navegador con ctrl + ruleta
    document.addEventListener('wheel', function(e) {        
        if(!document.body.classList.contains('gmv')) {
            e.preventDefault();
        }
    }, {passive: false});

    document.addEventListener('gesturestart', e => {
        if(!document.body.classList.contains('gmv')) {    
            e.preventDefault()}
        }
    );
    document.addEventListener('gesturechange', e => {
        if(!document.body.classList.contains('gmv')) {    
            e.preventDefault()}
        }
    );
    document.addEventListener('gestureend', e => {
        if(!document.body.classList.contains('gmv')) {    
            e.preventDefault()}
        }
    );

    //deshabilitar crtl + ctrl -
    document.addEventListener('keydown', function(e) {
        if(!document.body.classList.contains('gmv')) 
        {
            if(e.keyCode == 107 || e.keyCode == 187)
            {
                e.preventDefault();
                if(bootloader.teclas.CTRL.isDown || e.metaKey)
                {
                    var oldzoom = camera.zoom;
                    var newzoom = oldzoom * 1.1;
                    if(newzoom<1.09 && newzoom>0.91){ newzoom=1; }
                    
                    if(newzoom > 1)
                    {
                        bootloader.teclaPresionada = true;
                        camera.zoomTo(newzoom,0);

                        setTimeout(() => {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');
        
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
        
                            ajustarZoom(bootloader, newzoom);     
                        }, 25); 
                    }
                    else if(newzoom == 1)
                    {
                        bootloader.teclaPresionada = true;
                        camera.zoomTo(newzoom,0);

                        camera.scrollX = 0;
                        camera.scrollY = 0;
                        
                        setTimeout(() => {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');
        
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
        
                            ajustarZoom(bootloader, 1);    
                        }, 25); 
        
                        setTimeout(() => {
                            animYoyo(bootloader);
                        }, 300);
                    }
                    else
                    {
                        bootloader.teclaPresionada = true;
                        setTimeout(() => {
                            animYoyo(bootloader);
                        }, 50);
                    }
                }
            }
            if(e.keyCode == 109 || e.keyCode == 189)
            {
                e.preventDefault();
                if(bootloader.teclas.CTRL.isDown || e.metaKey)
                {
                    var oldzoom = camera.zoom;
                    var newzoom = oldzoom / 1.1;
                    if(newzoom<1.09 && newzoom>0.91){ newzoom=1; }
                    
                    if(newzoom > 1)
                    {
                        bootloader.teclaPresionada = true;
                        camera.zoomTo(newzoom,0);

                        setTimeout(() => {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');
        
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
        
                            ajustarZoom(bootloader, newzoom);
                        }, 25); 
                    }
                    else if(newzoom == 1)
                    {
                        bootloader.teclaPresionada = true;
                        camera.zoomTo(newzoom,0);

                        camera.scrollX = 0;
                        camera.scrollY = 0;
                        
                        setTimeout(() => {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');
        
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
        
                            ajustarZoom(bootloader, 1);
                        }, 25); 
        
                        setTimeout(() => {
                            animYoyo(bootloader);
                        }, 300);
                    }
                    else
                    {
                        bootloader.teclaPresionada = true;
                        setTimeout(() => {
                            animYoyo(bootloader);
                        }, 50);
                    }
                } 
            }
        }
    });

    //Botones de navegacion
    //Boton para aumentar el zoom
    document.getElementById('btnNavMax').onclick = function(){
        if(!bootloader.teclaPresionada)
        {    
            if(!document.body.classList.contains('gmv')) {
                var oldzoom = camera.zoom;
                if(oldzoom < 1)
                {
                    oldzoom = 1;
                }
                var newzoom = oldzoom * 1.1;
                if(newzoom<1.09 && newzoom>0.91){ newzoom=1; }
                
                bootloader.teclaPresionada = true;
                camera.zoomTo(newzoom,0);
                
                setTimeout(() => {
                    var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                    bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');

                    var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                    bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');

                    ajustarZoom(bootloader, newzoom);
                }, 25); 

                //this.blur();
            }
        }
    }

    //Boton para disminuir el zoom
    document.getElementById('btnNavMin').onclick = function(){
        if(!bootloader.teclaPresionada)
        {
            if(!document.body.classList.contains('gmv')) {
                var oldzoom = camera.zoom;
                if(oldzoom < 1)
                {
                    oldzoom = 1;
                }
                var newzoom = oldzoom / 1.1;
                if(newzoom<1.09 && newzoom>0.91){ newzoom=1; }
                
                if(newzoom > 1)
                {
                    bootloader.teclaPresionada = true;
                    camera.zoomTo(newzoom,0);

                    setTimeout(() => {
                        var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                        bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');
    
                        var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                        bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
    
                        ajustarZoom(bootloader, newzoom); 
                    }, 25); 
                }
                else if(newzoom == 1)
                {
                    bootloader.teclaPresionada = true;
                    camera.zoomTo(newzoom,0);

                    camera.scrollX = 0;
                    camera.scrollY = 0;
                    
                    setTimeout(() => {
                        var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                        bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');
    
                        var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                        bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
    
                        ajustarZoom(bootloader, 1);
                    }, 25); 
    
                    setTimeout(() => {
                        animYoyo(bootloader);
                    }, 300);
                }
                else
                {
                    bootloader.teclaPresionada = true;
                    setTimeout(() => {
                        animYoyo(bootloader);
                    }, 50);
                }

                //this.blur();
            }
        }
    }

    //Boton para volver al zoom inicial
    document.getElementById('btnNavIni').onclick = function(){
        if(!bootloader.teclaPresionada)
        {    
            if(!document.body.classList.contains('gmv')) 
            {
                bootloader.teclaPresionada = true;
                camera.zoomTo(1,0);

                camera.scrollX = 0;
                camera.scrollY = 0;
                
                setTimeout(() => {
                    var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                    bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');

                    var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                    bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');

                    ajustarZoom(bootloader, 1);
                }, 25); 

                setTimeout(() => {
                    animYoyo(bootloader);
                }, 300);

                //this.blur();
            }
        }
    }

    document.getElementById('btnNavMax').onpointerover = function() {
        bootloader.snHvr = 1;
    }
    document.getElementById('btnNavMin').onpointerover = function() {
        bootloader.snHvr = 1;
    }
    document.getElementById('btnNavIni').onpointerover = function() {
        bootloader.snHvr = 1;
    }

    document.getElementById('btnNavMax').onpointerout = function() {
        bootloader.snHvr = 0;
    }
    document.getElementById('btnNavMin').onpointerout = function() {
        bootloader.snHvr = 0;
    }
    document.getElementById('btnNavIni').onpointerout = function() {
        bootloader.snHvr = 0;
    }

    //arrastrar al pulsar con el boton del medio del raton o el izquierdo
    document.addEventListener('pointerdown', function(pointer) {
        if(!document.body.classList.contains('gmv') && ((pointer.target.nodeName != "svg")) && ((pointer.target.id != "gFsc")) && ((pointer.target.nodeName != "path")) && ((pointer.target.className == 'g__crz__grid__ltr') || (pointer.target.className == 'g__crz__cntr'))) 
        {
            bootloader.hayPointerDown = true;
            if(!bootloader.esMovil)
            {
                //if(pointer.target.nodeName == 'DIV')
                //{
                    if (pointer.button == 1 || pointer.button == 0)
                    {
                        bootloader.input.manager.setCursor({ cursor: 'grabbing' });
                        bootloader.input.setDefaultCursor("grabbing");
                        if(camera.zoom > 1)
                        {
                            bootloader.isMoving = true;
                        }
                    }
                //}
            }
        }
    });

    document.addEventListener('pointermove', function(pointer) {
        if(!document.body.classList.contains('gmv')) 
        {
            if(bootloader.hayPointerDown)
            {     
                if(!bootloader.esMovil)
                {
                    //if(pointer.target.nodeName == 'DIV')
                    //{  
                        if(bootloader.isMoving)
                        {
                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            desplazamientoBasico(bootloader);
                        }          
                    //}
                }
            }
        }
    });
    
    document.addEventListener('pointerup', function(pointer) {
        if((!document.body.classList.contains('gmv')) && (pointer.target.nodeName != "svg") && (pointer.target.id != "gFsc") && (pointer.target.nodeName != "path") && (pointer.target.className != "btn__nav__max") && (pointer.target.className != "btn__nav__min") && (pointer.target.className != "btn__nav__ini") && (pointer.target.nodeName != "rect")) 
        {
            if(!bootloader.esMovil)
            {
                if(!bootloader.teclas.SPACE.isDown)
                {
                    bootloader.input.manager.setCursor({ cursor: 'default' });
                    bootloader.input.setDefaultCursor("default");
                    bootloader.isMoving = false;

                    desplazamientoTotal(bootloader);
                }
            }
            bootloader.hayPointerDown = false;
        }
    });

    var last_position = {};
    document.addEventListener('pointermove', function(pointer) {
        if(!document.body.classList.contains('gmv')) 
        {
            if(!bootloader.esMovil)
            {
                if (((pointer.buttons == 1 || pointer.buttons == 4) && bootloader.isMoving))
                {
                    if (typeof(last_position.x) !== 'undefined') 
                    {
                        camera.scrollX -= (pointer.clientX - last_position.x) / camera.zoom;
                        camera.scrollY -= (pointer.clientY - last_position.y) / camera.zoom;
                    }
                }
                last_position = {
                    x : pointer.clientX,
                    y : pointer.clientY
                };
            }
        }
    });

    var last_position_touch = {};
    var pinching = false;
    var initialDistance = 0;
    var scroll = false;
    var oldzoom = camera.zoom;
    var zoomMovil = camera.zoom;
    var hayEventoTouch = false;
    document.addEventListener('touchstart', function(e) {
        if(!document.body.classList.contains('gmv')) 
        {
            if((bootloader.esMovil) && ((e.target.className == 'g__crz__grid__ltr') || (e.target.className == 'g__crz__cntr')))
            {    
                hayEventoTouch = true;
                if (e.touches.length == 2) 
                {
                    var touch1 = e.touches[0];
                    var touch2 = e.touches[1];
                    initialDistance = Phaser.Math.Distance.Between(touch1.pageX, touch1.pageY, touch2.pageX, touch2.pageY);
                    if(initialDistance < 72)
                    {
                        if((camera.zoom > 1) && (!pinching))
                        {    
                            scroll = true;
                            last_position_touch = {
                                x : (touch1.pageX+touch2.pageX)/2,
                                y : (touch1.pageY+touch2.pageY)/2
                            };
                        }
                    }
                    else
                    {
                        pinching = true;
                        isTouchMoving = true;
                        scroll = false;
                    }
                }
                else if(e.touches.length == 1)
                {
                    if((camera.zoom > 1) && (!pinching))
                    {    
                        scroll = true;
                        var touch = e.touches[0];
                        last_position_touch = {
                            x : touch.pageX,
                            y : touch.pageY
                        };
                    }
                }
            }
        }
    });
    document.addEventListener('touchmove', function(e) {
        
        if(!document.body.classList.contains('gmv')) 
        {
            if((bootloader.esMovil) && (hayEventoTouch))
            {
                if (pinching && e.touches.length == 2) 
                {
                    var touch1 = e.touches[0];
                    var touch2 = e.touches[1];
                    var distance = Phaser.Math.Distance.Between(touch1.pageX, touch1.pageY, touch2.pageX, touch2.pageY);
                    if (initialDistance == 0) 
                    {
                        initialDistance = distance;
                    }

                    if(distance > initialDistance)
                    {
                        oldzoom = camera.zoom;
                        if(bootloader.sys.game.device.os.iOS)
                        {
                            zoomMovil = oldzoom * 1.025; 
                        }
                        else
                        {
                            zoomMovil = oldzoom * 1.1;
                        }
                    }
                    else if(distance < initialDistance)
                    {
                        oldzoom = camera.zoom;
                        if(bootloader.sys.game.device.os.iOS)
                        {
                            zoomMovil = oldzoom * 0.975;  
                        }
                        else
                        {
                            zoomMovil = oldzoom * 0.9;
                        }
                    }
                    
                    if(distance != initialDistance)
                    {
                        if(zoomMovil > 1)
                        {
                            camera.zoomTo(zoomMovil,0);

                            ajustarZoomMovil(bootloader, zoomMovil);
                        }
                        else
                        {
                            camera.zoomTo(1,0);

                            camera.scrollX = 0;
                            camera.scrollY = 0;
                        }
                    }
                }
                else if (scroll && e.touches.length == 2)
                {
                    var touch1 = e.touches[0];
                    var touch2 = e.touches[1];
                    if (typeof(last_position_touch.x) !== 'undefined') 
                    {
                        camera.scrollX -= ((touch1.pageX+touch2.pageX)/2 - last_position_touch.x) / camera.zoom;
                        camera.scrollY -= ((touch1.pageY+touch2.pageY)/2 - last_position_touch.y) / camera.zoom;
                        last_position_touch = {};
                    }
                    last_position_touch = {
                        x : (touch1.pageX+touch2.pageX)/2,
                        y : (touch1.pageY+touch2.pageY)/2
                    };
                    desplazamientoMovil(bootloader);
                }
                else if(scroll && e.touches.length == 1)
                {
                    var touch = e.touches[0];
                    if (typeof(last_position_touch.x) !== 'undefined') 
                    {
                        camera.scrollX -= (touch.pageX - last_position_touch.x) / camera.zoom;
                        camera.scrollY -= (touch.pageY - last_position_touch.y) / camera.zoom;
                    }
                    last_position_touch = {
                        x : touch.pageX,
                        y : touch.pageY
                    };
                    desplazamientoMovil(bootloader);
                }
            }
        }
    });

    document.addEventListener('touchend', function(e) {
        if(!document.body.classList.contains('gmv')) 
        {
            if(bootloader.esMovil)
            {
                if(hayEventoTouch)
                {
                    if(e.touches.length != 2)
                    {
                        if(pinching)
                        {
                            pinching = false;

                            if(zoomMovil > 1)
                            {
                                ajustarTotalMovil(bootloader, zoomMovil, oldzoom);
                            }
                            else
                            {
                                setTimeout(() => {
                                    var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                                    bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');
                
                                    var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                                    bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');
                
                                    ajustarZoomMovil(bootloader, 1);
                                }, 25);

                                setTimeout(() => {
                                    animYoyo(bootloader);
                                }, 300);
                            }
                        }
                        
                    }
                    if(e.touches.length == 0)
                    {
                        if(scroll)
                        {
                            scroll = false;
                            desplazamientoTotalMovil(bootloader);
                        }
                        
                    }
                }
                else
                {
                    hayEventoTouch = false;
                }
            }
        }
    });
}

//FUNCIONES ORDENADOR
//Ajusta el grid html al grid phaser al hacer zoom
function ajustarZoomBasico(bootloader, newzoom, boolAux){
    
    setTimeout(() => {
        bootloader.grid.style.setProperty('left', -bootloader.grid.getBoundingClientRect().x + bootloader.coordenadaXGrid + 'px');
        bootloader.grid.style.setProperty('top', -bootloader.grid.getBoundingClientRect().y + bootloader.coordenadaYGrid + 'px');
        
        bootloader.grid.style.setProperty("transform", 'matrix(' + newzoom + ', 0, 0, ' + newzoom + ', ' + bootloader.gridPhaser.node.getBoundingClientRect().x + ', ' + bootloader.gridPhaser.node.getBoundingClientRect().y + ') skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');
        
        bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
        bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;

        bootloader.grid.style.setProperty('left', -bootloader.coordenadaXGrid + bootloader.gridPhaser.node.getBoundingClientRect().x + 'px');
        bootloader.grid.style.setProperty('top', -bootloader.coordenadaYGrid + bootloader.gridPhaser.node.getBoundingClientRect().y + 'px');

        if(boolAux)
        {    
            if(newzoom != 1)
            {
                bootloader.isWheel = false;
                bootloader.teclaPresionada = false;
            }
        }
    }, 30)
}

//Realiza la animacion Yoyo (también se usa en el móvil)
function animYoyo(bootloader){

    var matriz = window.getComputedStyle(bootloader.grid).transform;
    var coordX = (window.getComputedStyle(bootloader.grid).transform).split(', ')[4];
    var coordY = ((window.getComputedStyle(bootloader.grid).transform).split(', ')[5]).split(')')[0];
    //bootloader.grid.style.setProperty("transition", "transform .3s")
    bootloader.grid.style.setProperty("transform", 'matrix(0.95, 0, 0, 0.95,' + coordX + ', ' + coordY + ') skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');

    setTimeout(() => {
        bootloader.grid.style.setProperty("transform", matriz + 'skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');
        if(bootloader.isWheel || bootloader.teclaPresionada)
        {
            bootloader.isWheel = false;
            bootloader.teclaPresionada = false;
        }
    }, 200);
}

//Ajusta el grid html al grid phaser al desplazarnos
function desplazamientoBasico(bootloader){
    
    bootloader.grid.style.setProperty('left', -bootloader.grid.getBoundingClientRect().x + bootloader.coordenadaXGrid + 'px');
    bootloader.grid.style.setProperty('top', -bootloader.grid.getBoundingClientRect().y + bootloader.coordenadaYGrid + 'px');

    var tamU = ((window.getComputedStyle(bootloader.grid).transform).split(', ')[0]).split('(')[1];
    var tamV = (window.getComputedStyle(bootloader.grid).transform).split(', ')[3];
    
    bootloader.grid.style.setProperty("transform", 'matrix(' + tamU + ', 0, 0, ' + tamV + ', ' + bootloader.gridPhaser.node.getBoundingClientRect().x + ', ' + bootloader.gridPhaser.node.getBoundingClientRect().y + ') skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');
    
    bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
    bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;

    bootloader.grid.style.setProperty('left', -bootloader.coordenadaXGrid + bootloader.gridPhaser.node.getBoundingClientRect().x + 'px');
    bootloader.grid.style.setProperty('top', -bootloader.coordenadaYGrid + bootloader.gridPhaser.node.getBoundingClientRect().y + 'px');
    
}

//Ajusta el grid html al grid phaser y seguido los huecos phaser a los huecos html al hacer zoom
function ajustarZoom(bootloader, newzoom){
    
    bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
    bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
    ajustarZoomBasico(bootloader, newzoom, false);

    setTimeout(() => {
        
        if(newzoom != 1)
        {
            bootloader.isWheel = false;
            bootloader.teclaPresionada = false;
        }
    }, 50);
}

//Ajusta el grid phaser y el grid html a los límites del área visual al hacer zoom
function ajustarTotal(bootloader, newzoom, oldzoom){

    setTimeout(() => {
        if(window.innerHeight <= window.innerWidth)
        {
            if(bootloader.gridPhaser.node.getBoundingClientRect().width < bootloader.areaVisual.getBoundingClientRect().width)
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left <= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right >= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');  
                            
                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left > bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right < bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {  

                            if(newzoom >= oldzoom)
                            {    

                                bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                                bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                                ajustarZoomBasico(bootloader, newzoom, true);
                            }
                            else
                            {
                                    
                                var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                                bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');

                                var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                                bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');

                                ajustarZoom(bootloader, newzoom); 
                            }
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');  

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left >= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right <= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    }                                  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {

                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            ajustarZoomBasico(bootloader, newzoom, true);
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                    }   
                }
            }
        }
        else
        {
            if((bootloader.gridPhaser.node.getBoundingClientRect().height < bootloader.areaVisual.getBoundingClientRect().height))
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top <= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    }   
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom >= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top > bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom < bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        { 

                            if(newzoom >= oldzoom)
                            {   

                                bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                                bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                                ajustarZoomBasico(bootloader, newzoom, true);
                            }
                            else
                            {
                                    
                                var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                                bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');

                                var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                                bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');

                                ajustarZoom(bootloader, newzoom); 
                            }
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top >= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            
                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom <= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            ajustarZoom(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {   

                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            ajustarZoomBasico(bootloader, newzoom, true); 
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoom(bootloader, newzoom);
                        }
                    }  
                }
            }
        }
    }, 25)
}

//Ajusta el grid html al grid phaser y los huecos phaser a los huecos html al desplazarnos
function desplazamiento(bootloader){

    bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
    bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
    desplazamientoBasico(bootloader);
}

//Ajusta el grid phaser y el grid html a los límites del área visual al desplazarse
function desplazamientoTotal(bootloader){

    setTimeout(() => {
        if(window.innerHeight <= window.innerWidth)
        {
            if(bootloader.gridPhaser.node.getBoundingClientRect().width < bootloader.areaVisual.getBoundingClientRect().width)
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left <= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamiento(bootloader);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right >= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');  
                            
                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamiento(bootloader);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left > bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right < bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        { 
                            
                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            desplazamientoBasico(bootloader);
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');  

                            desplazamiento(bootloader);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left >= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamiento(bootloader);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right <= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');

                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamiento(bootloader);
                        }
                    }                                  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        { 
                            
                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            desplazamientoBasico(bootloader);
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamiento(bootloader);
                        }
                    }   
                }
            }
        }
        else
        {
            if((bootloader.gridPhaser.node.getBoundingClientRect().height < bootloader.areaVisual.getBoundingClientRect().height))
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top <= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                    }   
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom >= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top > bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom < bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            
                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            desplazamientoBasico(bootloader);
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top >= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            
                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom <= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            desplazamiento(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            
                            bootloader.coordenadaXGrid = bootloader.grid.getBoundingClientRect().x;
                            bootloader.coordenadaYGrid = bootloader.grid.getBoundingClientRect().y;
                            desplazamientoBasico(bootloader);
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamiento(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamiento(bootloader);
                        }
                    }  
                }
            }
        }
    }, 25)
}

//FUNCIONES MOVIL
//Ajusta el grid html al grid phaser al hacer zoom
function ajustarZoomMovil(bootloader, zoom){
    //setTimeout(() => {    
        bootloader.grid.style.setProperty("transform", 'matrix(' + zoom + ', 0, 0, ' + zoom + ', ' + 0 + ', ' + 0 + ') skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');
        
        var cX = bootloader.gridPhaser.node.getBoundingClientRect().x - bootloader.grid.getBoundingClientRect().x;
        var cY = bootloader.gridPhaser.node.getBoundingClientRect().y - bootloader.grid.getBoundingClientRect().y;
        bootloader.grid.style.setProperty("transform", 'matrix(' + zoom + ', 0, 0, ' + zoom + ', ' + cX + ', ' + cY + ') skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');
    //}, 20)
}

//Ajusta el grid html al grid phaser al desplazarnos
function desplazamientoMovil(bootloader){
            
    //setTimeout(() => { 
        var tamU = ((window.getComputedStyle(bootloader.grid).transform).split(', ')[0]).split('(')[1];
        var tamV = (window.getComputedStyle(bootloader.grid).transform).split(', ')[3];
        bootloader.grid.style.setProperty("transform", 'matrix(' + tamU + ', 0, 0, ' + tamV + ', ' + 0 + ', ' + 0 + ') skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');

        var cX = bootloader.gridPhaser.node.getBoundingClientRect().x - bootloader.grid.getBoundingClientRect().x;
        var cY = bootloader.gridPhaser.node.getBoundingClientRect().y - bootloader.grid.getBoundingClientRect().y;
        bootloader.grid.style.setProperty("transform", 'matrix(' + tamU + ', 0, 0, ' + tamV + ', ' + cX + ', ' + cY + ') skew(0rad, 0rad) rotate3d(0, 0, 0, 0deg)');
    //}, 50)
}

//Ajusta el grid phaser y el grid html a los límites del área visual al hacer zoom
function ajustarTotalMovil(bootloader, newzoom, oldzoom){

    setTimeout(() => {
        if(window.innerHeight <= window.innerWidth)
        {
            if(bootloader.gridPhaser.node.getBoundingClientRect().width < bootloader.areaVisual.getBoundingClientRect().width)
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left <= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right >= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');  
                            
                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left > bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right < bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        { 

                            if(newzoom >= oldzoom)
                            {

                                ajustarZoomMovil(bootloader, newzoom);
                            }
                            else
                            {
                                    
                                var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                                bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');

                                var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                                bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');

                                ajustarZoomMovil(bootloader, newzoom); 
                            }
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');  

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left >= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right <= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }                                  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }   
                }
            }
        }
        else
        {
            if((bootloader.gridPhaser.node.getBoundingClientRect().height < bootloader.areaVisual.getBoundingClientRect().height))
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top <= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }   
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom >= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top > bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom < bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {

                            if(newzoom >= oldzoom)
                            {

                                ajustarZoomMovil(bootloader, newzoom);
                            }
                            else
                            {
                                    
                                var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                                bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().left + (bootloader.areaVisual.getBoundingClientRect().width / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().width / 2)) + 'px');

                                var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                                bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().top + (bootloader.areaVisual.getBoundingClientRect().height / 2) - (bootloader.gridPhaser.node.getBoundingClientRect().height / 2)) + 'px');

                                ajustarZoomMovil(bootloader, newzoom);
                            }
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top >= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            
                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom <= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            ajustarZoomMovil(bootloader, newzoom);
                        }
                    }  
                }
            }
        }
    }, 25)
}

//Ajusta el grid phaser y el grid html a los límites del área visual al desplazarse
function desplazamientoTotalMovil(bootloader){

    setTimeout(() => {
        if(window.innerHeight <= window.innerWidth)
        {
            if(bootloader.gridPhaser.node.getBoundingClientRect().width < bootloader.areaVisual.getBoundingClientRect().width)
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left <= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right >= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');  
                            
                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left > bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right < bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');  

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().left >= bootloader.areaVisual.getBoundingClientRect().left)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().right <= bootloader.areaVisual.getBoundingClientRect().right)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {                                         
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px');

                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux1 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux1 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 
                            var aux2 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux2 + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    }                                  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) && (bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            
                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom)
                        {
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamientoMovil(bootloader);
                        }
                    }   
                }
            }
        }
        else
        {
            if((bootloader.gridPhaser.node.getBoundingClientRect().height < bootloader.areaVisual.getBoundingClientRect().height))
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top <= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');

                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    }   
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom >= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');

                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top > bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom < bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            
                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
            }
            else
            {
                if(bootloader.gridPhaser.node.getBoundingClientRect().top >= bootloader.areaVisual.getBoundingClientRect().top)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            
                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + bootloader.areaVisual.getBoundingClientRect().top + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
                else if(bootloader.gridPhaser.node.getBoundingClientRect().bottom <= bootloader.areaVisual.getBoundingClientRect().bottom)
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {                                         
                            var aux = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            
                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux1 = ((window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[5]).split(')')[0];
                            bootloader.gridPhaser.node.style.setProperty('top', -aux1 + (bootloader.areaVisual.getBoundingClientRect().bottom - bootloader.gridPhaser.node.getBoundingClientRect().height) + 'px');
                            var aux2 = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux2 + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
                else if((bootloader.gridPhaser.node.getBoundingClientRect().top < bootloader.areaVisual.getBoundingClientRect().top) && (bootloader.gridPhaser.node.getBoundingClientRect().bottom > bootloader.areaVisual.getBoundingClientRect().bottom))
                {
                    if(bootloader.gridPhaser.node.getBoundingClientRect().left < bootloader.areaVisual.getBoundingClientRect().left) 
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            
                            desplazamientoMovil(bootloader);
                        }
                        else
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + (bootloader.areaVisual.getBoundingClientRect().right - bootloader.gridPhaser.node.getBoundingClientRect().width) + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    } 
                    else
                    {
                        if(bootloader.gridPhaser.node.getBoundingClientRect().right > bootloader.areaVisual.getBoundingClientRect().right)
                        {
                            var aux = (window.getComputedStyle(bootloader.gridPhaser.node).transform).split(', ')[4];
                            bootloader.gridPhaser.node.style.setProperty('left', -aux + bootloader.areaVisual.getBoundingClientRect().left + 'px'); 

                            desplazamientoMovil(bootloader);
                        }
                    }  
                }
            }
        }
    }, 25)
}