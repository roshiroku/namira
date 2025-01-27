import ImageType from './ImageType';
export declare const compareImages: (data1: ImageData, data2: ImageData) => Promise<number>;
export declare const estimateFileSize: (src: string) => number;
export declare const inferImageType: (src: string) => ImageType;
