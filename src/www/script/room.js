var roomsocket = io()
roomsocket.emit('type', 'room')
console.log('room')

var isFirst = []
roomsocket.on('rotate3d', function (res) {
  var box = document.getElementById(res.id)
  if(!box){
    createBox(res.id)
  }
  var msg = res.data
  if (isFirst.indexOf(res.id)==-1){
      isFirst.push(res.id)
      document.getElementById('adj-'+res.id).style.transform = "rotate3d("+ (-msg.x) + "," + msg.y + "," + (-msg.z) + ","+ (-msg.rotate) +"deg)"
  }
  document.getElementById(res.id).style.transform = "rotate3d("+ (-msg.x) + "," + msg.y + "," + (-msg.z) + ","+ (msg.rotate) +"deg)"
})

roomsocket.on('device', createBox)

roomsocket.on('remove', function(id){
  var section = document.getElementsByTagName('section')[0]
  var box = document.getElementById('adj-'+id)
  if(box){
    section.removeChild(box)
  }
})

function createBox(id){
  var box = document.createElement('div')
  box.setAttribute('class', "adjust")
  box.setAttribute('id','adj-'+id)
  box.innerHTML = '<div class="box" id="'+id+'">\
      <figure class="front">前</figure>\
      <figure class="back">后</figure>\
      <figure class="right">右</figure>\
      <figure class="left">左</figure>\
      <figure class="top">顶</figure>\
      <figure class="bottom">底</figure>\
    </div>'
  document.getElementsByTagName('section')[0].appendChild(box)
}

roomsocket.on('connect', function(){
  new QRCode(document.getElementById('qrcode'), "http://192.168.1.40:8080/device?roomid=" + roomsocket.id)
})
