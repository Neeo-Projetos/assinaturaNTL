declare module 'gifencoder' {
    export default class GIFEncoder {
        constructor(width: number, height: number);
        createReadStream(): any;
        start(): void;
        setRepeat(iter: number): void;
        setDelay(ms: number): void;
        setQuality(quality: number): void;
        addFrame(ctx: any): void;
        finish(): void;
    }
}
