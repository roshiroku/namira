import ImageType from './ImageType';
import { compareImages, estimateFileSize, inferImageType } from './utils';
class ImageModel {
    filename;
    type;
    size;
    src;
    img;
    canvas;
    ctx;
    static create(input) {
        return new Promise((resolve, reject) => {
            const data = {};
            const img = new Image();
            img.onload = () => resolve(new ImageModel({ ...data, img }));
            img.onerror = () => reject(new Error('Failed to load image'));
            if (input instanceof File) {
                const reader = new FileReader();
                reader.onload = () => data.src = img.src = `${reader.result}`;
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(input);
                data.filename = input.name;
                data.type = input.type;
                data.size = input.size;
            }
            else {
                data.src = img.src = input;
                data.filename = input.split('/').pop() || 'unknown';
                data.type = inferImageType(input);
                data.size = 0; // Size is not available for URL sources
            }
        });
    }
    constructor({ filename, type, size, src, img }) {
        this.filename = filename;
        this.type = type;
        this.size = size;
        this.src = src;
        this.img = img;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        if (this.img.complete) {
            this.initializeCanvas();
        }
        else {
            this.img.onload = () => this.initializeCanvas();
        }
    }
    get name() {
        return this.filename.replace(/\.[^.]+$/, '');
    }
    initializeCanvas() {
        this.canvas.width = this.img.width;
        this.canvas.height = this.img.height;
        this.ctx.drawImage(this.img, 0, 0);
    }
    getDataURL(type = this.type, quality) {
        const format = type === ImageType.JPG ? ImageType.JPEG : type;
        return this.canvas.toDataURL(`${format}`, quality);
    }
    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    convert(type, quality) {
        return new Promise((resolve) => {
            const src = this.getDataURL(type, quality);
            const img = new Image();
            img.onload = () => {
                const filename = `${this.name}.${`${type}`.split('/').pop()}`;
                resolve(new ImageModel({ filename, type, size: estimateFileSize(src), src, img }));
            };
            img.src = src;
        });
    }
    async convertAutoQuality(type, config = {}) {
        const { maxDifference = 0.005, initialQuality = 1 } = config;
        const imageData = this.getImageData();
        let low = 0;
        let high = initialQuality;
        let image = this.type === type ? this : await this.convert(type, initialQuality);
        const baseDiff = await compareImages(imageData, image.getImageData());
        while (high - low > 0.001) {
            const quality = (low + high) / 2;
            const convertedImage = await this.convert(type, quality);
            const difference = await compareImages(imageData, convertedImage.getImageData());
            if (difference <= maxDifference + baseDiff) {
                image = convertedImage;
                high = quality; // Try lower qualities
            }
            else {
                low = quality; // Increase quality
            }
        }
        return { image, quality: high };
    }
    async compress(maxFileSize, type, initialQuality = 1) {
        let low = 0;
        let high = initialQuality;
        let image = this;
        while (high - low > 0.001) {
            const quality = (low + high) / 2;
            const convertedImage = await this.convert(type, quality);
            if (convertedImage.size <= maxFileSize) {
                image = convertedImage;
                low = quality; // Increase quality to fit within the file size constraint
            }
            else {
                high = quality; // Try lower qualities to further reduce file size
            }
        }
        return { image, quality: low };
    }
}
export default ImageModel;
//# sourceMappingURL=ImageModel.js.map