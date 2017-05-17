var usersocket = io ()
usersocket.emit('type', 'device')
var lastTime = 0;

var degtorad = Math.PI / 180;
function getQuaternion( alpha, beta, gamma ) {

  var _x = beta  ? beta  * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos( _x/2 );
  var cY = Math.cos( _y/2 );
  var cZ = Math.cos( _z/2 );
  var sX = Math.sin( _x/2 );
  var sY = Math.sin( _y/2 );
  var sZ = Math.sin( _z/2 );

  //
  // ZXY quaternion construction.
  //

  var w = cX * cY * cZ - sX * sY * sZ;
  var x = sX * cY * cZ - cX * sY * sZ;
  var y = cX * sY * cZ + sX * cY * sZ;
  var z = cX * cY * sZ + sX * sY * cZ;

  return [ w, x, y, z ];

}

function getAcQuaternion( _w, _x, _y, _z ) {  //我的四元数转旋转轴和旋转角度方法

  var rotate = 2 * Math.acos(_w)/degtorad ;

  var x = _x / Math.sin(degtorad * rotate/2) || 0;
  var y = _y / Math.sin(degtorad * rotate/2) || 0;
  var z = _z / Math.sin(degtorad * rotate/2) || 0;

  return {x:x,y:y,z:z,rotate:rotate};

}


window.addEventListener('deviceorientation', function(evt){
  var qu = getQuaternion(evt.alpha,evt.beta,evt.gamma);
  var rotate3d = getAcQuaternion(qu[0],qu[1],qu[2],qu[3]);
  // document.getElementById("info").innerHTML = "z轴旋转 alpha: 　" + evt.alpha + "<br>"
  //       + "y轴旋转 gamma: 　" + evt.gamma + "<br>"
  //       + "x轴旋转 beta: 　" + evt.beta

  usersocket.emit('rotate3d', rotate3d)
})

usersocket.on('disconnect', function(){
  document.getElementById("info").innerHTML = "房间已关闭，请重新扫码"
})

