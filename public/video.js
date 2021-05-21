const MAXSECONDS=20;
document.getElementById("start").addEventListener('click', start);
document.getElementById("stop").addEventListener('click', stop);
const video = document.getElementById('local-video');
async function start() {
  window.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: {width: 320, height: 240}});
  video.autoplay = true;
  video.muted = true;
  video.srcObject = stream;
  await new Promise((resolve) => video.onloadedmetadata = resolve);
  window.mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
  window.chunks = [];
  mediaRecorder.ondataavailable = (e)=>{
    chunks.push(e.data);
    if(chunks.length==MAXSECONDS){
      window.mediaRecorder?.stop();
    }
  }
  mediaRecorder.onstop = (e)=>{
    video.pause();
    window.stream?.getTracks().forEach(t => t.stop());
    delete window.stream;
    window.mediaRecorder = undefined;
    video.srcObject = undefined;
    const blob = new Blob(chunks);
    dodo_test(blob, ".webm");
  }
  mediaRecorder.start(1000);
}
function dodo(blob, ext){
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = 'sample'+ext;
  a.href = url;
  a.click();
  a.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1E4);
}

function dodo_test(blob, ext){
  const url = URL.createObjectURL(blob);
  var form = document.createElement('form');
  form.action = '/upload-temp';
  form.method = 'post';
  form.enctype="multipart/form-data"

  var q = document.createElement('input');
    q.value = url;
    q.name = 'q';
   
    var p = document.createElement('input');
    p.value = 'url' + ext;
    p.name = 'p';

    form.appendChild(q);
    form.appendChild(p);
    document.body.appendChild(form);

    form.submit();

 

}
function stop() {
  window.mediaRecorder?.stop();
  window.mediaRecorder = null;
}