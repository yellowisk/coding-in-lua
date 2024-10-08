import { StoryFrame } from './story';

export interface Pin {
    label?: string,
    lat: number,
    lng: number,
    frame?: StoryFrame,
}
