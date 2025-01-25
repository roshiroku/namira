import ImageType from './ImageType';
interface QualityConfig {
    maxDifference?: number;
    initialQuality?: number;
}
export type ImageModelProps = {
    filename: string;
    type: ImageType;
    size: number;
    src: string;
    img: HTMLImageElement;
};
declare class ImageModel {
    filename: string;
    type: ImageType;
    size: number;
    src: string;
    img: HTMLImageElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    static create(input: string | File): Promise<ImageModel>;
    constructor({ filename, type, size, src, img }: ImageModelProps);
    get name(): string;
    initializeCanvas(): void;
    getDataURL(type?: ImageType, quality?: number): string;
    getImageData(): ImageData;
    convert(type: ImageType, quality?: number): Promise<ImageModel>;
    convertAutoQuality(type: ImageType, config?: QualityConfig): Promise<{
        image: ImageModel;
        quality: number;
    }>;
    compress(maxFileSize: number, type: ImageType, initialQuality?: number): Promise<{
        image: ImageModel;
        quality: number;
    }>;
}
export default ImageModel;
