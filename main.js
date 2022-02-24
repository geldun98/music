const data =[{
    id:1,
    lyric:`I can show you the world`,
    ipa:`aɪ kæn ʃoʊ ju ðə wɜrld`
},
{
    id:2,
    lyric:`Shining, shimmering, splendid`,
    ipa:`ˈʃaɪnɪŋ ˈʃɪmərɪŋ ˈsplɛndɪd`
},
{
    id:3,
    lyric:`Tell me, princess, now when did you last let your heart decide?`,
    ipa:`tɛl mi, ˈprɪnsɛs, naʊ wɛn dɪd ju læst lɛt jʊər hɑrt 'dɪsaɪd`
},
{
    id:4,
    lyric:`I can open your eyes`,
    ipa:`aɪ kæn ˈoʊpən jʊər aɪz`
}]
let idMusic=1;
const getMusic=document.getElementById('musicplayer')
getMusic.setAttribute('src',`./audio/${idMusic}.mp3`)
const musictext=document.getElementById('music-text')
document.querySelector('.music-lyric').innerHTML=data[idMusic-1].lyric


document.querySelector('.music-ipa').innerHTML=data[idMusic-1].ipa

const lengthaudio=document.getElementById('lengthaudio').innerHTML;
document.getElementById('progress-percent').style.width=`${idMusic*100/lengthaudio}%`
musictext.innerHTML=`Sentence: ${idMusic}`

class VoiceRecorder{
 constructor(){
     
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
    this.startRef.classList.add('hide')
    this.stopRef.classList.remove('hide')
    this.playerRef.src=''
    navigator.mediaDevices.getUserMedia(this.constraints)
    .then(this.handleSucess.bind(this))
    .catch(this.handleSucess.bind(this))
 }
 stopRecording(){

    if(!this.isRecording) return
    this.isRecording=false
    this.startRef.classList.remove('hide')
    this.stopRef.classList.add('hide')
    this.recorderRef.pause()
    this.mediaRecorder.stop()
 }
}
window.VoiceRecorder=new VoiceRecorder()


function handleNext(){
    idMusic=idMusic+1;
    getMusic.setAttribute('src',`./audio/${idMusic}.mp3`)
    musictext.innerHTML=`Sentence: ${idMusic}`
    document.getElementById('progress-percent').style.width=`${idMusic*100/lengthaudio}%`
    document.querySelector('.music-lyric').innerHTML=data[idMusic-1].lyric

document.querySelector('.music-ipa').innerHTML=data[idMusic-1].ipa
}