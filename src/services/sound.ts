export class SoundService {
    static playEffect(name: string) {
        const audio = new Audio(`/sounds/${name}.mp3`);
        audio.play();
    }
} 