const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo(){
    // connect to webcam and video element
    navigator.mediaDevices.getUserMedia({video:true, audio:false})
        .then(localMediaStream => {
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error("Oh No!!", err);
        });
}

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // coorperative concurrency - asnychronous programming!!
    return setInterval(() => {
// passing  video or imgage, start and 00 pass a frame to canvas every 16ms
        ctx.drawImage(video, 0,0, width, height);
        // Take out pixels, console log pixels, every for values represent a color - rgba
        let pixels = ctx.getImageData(0,0,width,height);

        // mess with pixels
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels)
        // ctx.globalApha = 0.1;
        // put them back
        ctx.putImageData(pixels,0,0);
    },16);
}

function takePhoto(){
    // play sound
    snap.currentTime = 0;
    snap.play();

    // takes the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'emeka');
    link.innerHTML = `<img src="${data}" alt="bobo" />`;
    strip.insertBefore(link, strip.firstChild);

}

function redEffect(pixels){
    for (let i=0; i <pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
        pixels.data[i + 1] = pixels.data[i + 0] - 50; // green
        pixels.data[i + 2] = pixels.data[i + 0] * 0.5; // blue
    }
    return pixels;
}

function rgbSplit(pixels){
    for (let i=0; i <pixels.data.length; i+=4){
        pixels.data[i - 350] = pixels.data[i + 0]; // red
        pixels.data[i + 500] = pixels.data[i + 1]; // green
        pixels.data[i + 550] = pixels.data[i + 2]; // blue
    }
    return pixels;
}

// clear Idea. not clear code
function greenScreen(pixels){
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    for (let i =0; i < pixels.data.length; i+=4){
        red = pixels.data[i+0];
        green = pixels.data[i+1];
        blue = pixels.data[i+2];
        alpha = pixels.data[i+3];
        
        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax){
                pixels.data[i+3] = 0; // transparent color
            }
    }
    return pixels;
}


getVideo();
// once video is playing it emmit an event - can play
video.addEventListener('canplay',paintToCanvas)
