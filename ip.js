var interfaces = require('os').networkInterfaces()

function getLocalIp() {
  var ips = []
  for(interface in interfaces) {
    var nets = interfaces[interface]
    for(var i = 0; i < nets.length; i++) {
      var net = nets[i]
      if(net.family === 'IPv4'
        && net.address !== '127.0.0.1'
        && !net.internal) {
        ips.push(net.address)
      }
    }
  }
  return ips 
}
module.exports = getLocalIp