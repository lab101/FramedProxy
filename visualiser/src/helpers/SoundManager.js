import gsap from "gsap";

export default class SoundManager {


    constructor() {

        this.audioFiles = [];
        this.addSoundFiles("ambient", "sound/ambient.wav");

        this.addSoundFiles("1_welcome", "sound/1_welcome.wav");
        this.addSoundFiles("2_globalreadiness", "sound/2_globalreadiness.wav");
        this.addSoundFiles("3_focus", "sound/3_focus.wav");
        this.addSoundFiles("4_fuel_protect", "sound/4_fuel_protect.wav");
        this.addSoundFiles("5_unlock", "sound/5_unlock.wav");
        this.addSoundFiles("6_choose_partner", "sound/6_choose_partner.wav");
        this.addSoundFiles("7_explore", "sound/7_explore.wav");
        this.addSoundFiles("8_visit_theater", "sound/8_visit_theater.wav");


        // setup multichannel audio for 8 channels
        // this.audioChannels = [];
        // for (let i = 0; i < 8; i++) {
        //     this.audioChannels[i] = new Audio();
        //     this.audioChannels[i].volume = 0.5;
        // }

        this.currentChannel = 0;




    }

    //singleton
    static getInstance() {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    addSoundFiles(name, path){
        this.audioFiles[name] = new Audio(path);
    }

    getSoundFiles(){
        // get keys from object
        return Object.keys(this.audioFiles);
    }


    stopAll(dontFadeAmbient=false){

        console.log("SoundManager: stopping all sounds");
        console.log(this.audioFiles.length);

        let keys = Object.keys(this.audioFiles);


        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            console.log("SoundManager: stopping sound: " + key);

            console.log(dontFadeAmbient);
            if(key == "ambient" && dontFadeAmbient){
                console.log("SoundManager: not fading ambient");
                continue;
            }

            gsap.to(this.audioFiles[key], {volume: 0, duration: 4}).then(() => {
                this.audioFiles[key].pause();
                this.audioFiles[key].currentTime = 0;
            });
        }

       
    }


    playSound(name){
        // check if name is in array
        if(this.audioFiles[name] == null){
            console.log("SoundManager: sound not found: " + name);
            return;
        }

        // set volume
        if(name == "ambient"){
            this.audioFiles[name].volume = 0.8;
        }else{
            this.audioFiles[name].volume = 0.25 ;
        }

        console.log("SoundManager: playing sound: " + name);
        this.audioFiles[name].play();
    }
}
