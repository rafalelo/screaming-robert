var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');
var screaming = document.getElementById('screaming')
var not_screaming = document.getElementById('not-screaming')
document.getElementsByTagName('body')[0].onload = function() {
 
  // note: for iOS Safari, the constructor must be called in response to a tap, or else the AudioContext will remain
  // suspended and will not provide any audio data.
  var micStream = new MicrophoneStream({bufferSize: 256});
  var threshold = 5
  var last = false
  $('.threshold').html("Threshold:" + Math.round(threshold*10))
  document.getElementsByTagName('body')[0].onkeypress = (event) => {
      if(event.keyCode === 119){
          threshold += 0.1
          $('.threshold').html("Threshold:" + Math.round(threshold*10))
      }
      if(event.keyCode === 115 && threshold>=0){
          threshold -= 0.1 
          $('.threshold').html("Threshold:" + Math.round(threshold*10))
      }
      console.log(threshold)
  }
 
  getUserMedia({ video: false, audio: true })
    .then(function(stream) {
      micStream.setStream(stream);
    }).catch(function(error) {
      console.log(error);
    });
 
  // get Buffers (Essentially a Uint8Array DataView of the same Float32 values)
  micStream.on('data', function(chunk) {
    // Optionally convert the Buffer back into a Float32Array
    // (This actually just creates a new DataView - the underlying audio data is not copied or modified.)
    var input = MicrophoneStream.toRaw(chunk)
    var sum = 0
    var clipcount = 0
    //...
    for (i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];

      }
      if(sum>threshold){
          not_screaming.style.display = "none"
          screaming.style.display = "block"
          last = true
          
            
        }
        else if(last){
          last = false

        }
        else{
          screaming.style.display = "none"
          not_screaming.style.display = "block"
          last = false
        }
        
    // note: if you set options.objectMode=true, the `data` event will output AudioBuffers instead of Buffers
   });

 }
 