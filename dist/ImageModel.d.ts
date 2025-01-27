import ImageType from './ImageType';
export type ConversionSettings = {
    quality?: number;
    maxFileSize?: number;
};
export type QualityConfig = {
    maxDifference?: number;
    initialQuality?: number;
};
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
    convert(type: ImageType, settings?: ConversionSettings): Promise<ImageModel>;
    convertQuality(type: ImageType, quality: number): Promise<ImageModel>;
    convertAutoQuality(type: ImageType, config?: QualityConfig): Promise<ImageModel>;
    compress(maxFileSize: number, type?: ImageType): Promise<ImageModel>;
}
export default ImageModel;
