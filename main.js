class VoiceRecorder{
 constructor(){
     if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
         console.log("GET user media suported")
     }
     else{
         console.log("Get user media NOT suported")
     }
     this.mediaRecoder
     this.stream
     this.chunks=[]
     this.isRecording=false
     this.recorderRef=document.getElementById("recorder")
     this.playerRef=document.getElementById("player")
     this.startRef=document.getElementById("start")
     this.stopRef=document.getElementById("stop")
     this.startRef.onclick=this.startRecording.bind(this)
     this.stopRef.onclick=this.stopRecording.bind(this)
     this.constraints={
         audio:true,
         video:false
     }
 }
 //handle sucess
 handleSucess(stream){
     this.stream=stream
     this.stream.oninactive=()=>{
         console.log("stream ended")
     }
    this.recorderRef.srcObject=this.stream
    this.mediaRecorder=new MediaRecorder(this.stream)
    this.mediaRecorder.ondataavailable=this.onMediaRecorderDataAvailable.bind(this)
    this.mediaRecorder.onstop=this.onMediaRecorderStop.bind(this)
    this.recorderRef.play();
    this.mediaRecorder.start()
 }
 onMediaRecorderDataAvailable(e){
     this.chunks.push(e.data)
 }
 onMediaRecorderStop(e){
     const blob=new Blob(this.chunks,{'type:':'audio/ogg; codesc=opus'})
     const audioURL=window.URL.createObjectURL(blob)
     this.playerRef.src=audioURL;
     this.chunks=[]
     this.stream.getAudioTracks().forEach(track=>track.stop())
     this.stream=null

 }
 //start recordeing
 startRecording(){

    if(this.isRecording) return
    this.isRecording=true
    this.startRef.innerHTML="Recording ..."
    this.playerRef.src=''
    navigator.mediaDevices.getUserMedia(this.constraints)
    .then(this.handleSucess.bind(this))
    .catch(this.handleSucess.bind(this))
 }
 stopRecording(){

    if(!this.isRecording) return
    this.isRecording=false
    this.startRef.innerHTML="Record"
    this.recorderRef.pause()
    this.mediaRecorder.stop()
 }
}
window.VoiceRecorder=new VoiceRecorder()