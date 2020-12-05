/* DEFINIÇÕES DE TIPOS */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var InterfaceStatus;
(function (InterfaceStatus) {
    InterfaceStatus["waitingForTextures"] = "waiting-for-textures";
    InterfaceStatus["showingCanvasRendering"] = "showing-canvas-rendering";
    InterfaceStatus["selectingdirectionalLightSourcePosition"] = "selecting-directional-light-source-position";
})(InterfaceStatus || (InterfaceStatus = {}));
class BidimensionalVector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getDotProduct(other) {
        return this.x * other.x + this.y * other.y;
    }
    getMagnitude() {
        const dotProduct = this.getDotProduct(this);
        return Math.sqrt(dotProduct);
    }
    normalize() {
        return this.divide(this.getMagnitude());
    }
    divide(other) {
        if (other instanceof BidimensionalVector) {
            this.x /= other.x;
            this.y /= other.y;
        }
        else {
            this.x /= other;
            this.y /= other;
        }
        return this;
    }
    invert() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    clone() {
        return new BidimensionalVector(this.x, this.y);
    }
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    transformIntoPixelRepresentation() {
        return new PixelRepresentation(this.x, this.y, 1, 1, false, true);
    }
}
class PixelRepresentation {
    constructor(red, green, blue, alpha, skipChecks = false, isFractional = false) {
        if (skipChecks) {
            this._red = red;
            this._green = green;
            this._blue = blue;
            this._alpha = alpha;
            return;
        }
        if (isFractional) {
            this.fractionalRed = red;
            this.fractionalGreen = green;
            this.fractionalBlue = blue;
            this.fractionalAlpha = alpha;
        }
        else {
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.alpha = alpha;
        }
    }
    get red() {
        return this._red;
    }
    get green() {
        return this._green;
    }
    get blue() {
        return this._blue;
    }
    ;
    get alpha() {
        return this._alpha;
    }
    ;
    set red(value) {
        this._red = Math.min(Math.max(-255, value), 255);
    }
    set green(value) {
        this._green = Math.min(Math.max(-255, value), 255);
    }
    set blue(value) {
        this._blue = Math.min(Math.max(-255, value), 255);
    }
    ;
    set alpha(value) {
        this._alpha = Math.min(Math.max(-255, value), 255);
    }
    ;
    get fractionalRed() {
        return this.red / 255;
    }
    get fractionalGreen() {
        return this.green / 255;
    }
    get fractionalBlue() {
        return this.blue / 255;
    }
    ;
    get fractionalAlpha() {
        return this.alpha / 255;
    }
    ;
    set fractionalRed(value) {
        this.red = Math.round(value * 255);
    }
    set fractionalGreen(value) {
        this.green = Math.round(value * 255);
    }
    set fractionalBlue(value) {
        this.blue = Math.round(value * 255);
    }
    ;
    set fractionalAlpha(value) {
        this.alpha = Math.round(value * 255);
    }
    ;
    static fromHexadecimalColor(hexadecimalColor) {
        const red = parseInt(hexadecimalColor.slice(1, 3), 16);
        const green = parseInt(hexadecimalColor.slice(3, 5), 16);
        const blue = parseInt(hexadecimalColor.slice(5, 7), 16);
        const alpha = 255;
        return new PixelRepresentation(red, green, blue, alpha, true);
    }
    getDotProduct(other) {
        return this.fractionalRed * other.fractionalRed + this.fractionalGreen * other.fractionalGreen + this.fractionalRed * other.fractionalRed;
    }
    getMagnitude() {
        const dotProduct = this.getDotProduct(this);
        return Math.sqrt(dotProduct);
    }
    centerize() {
        this.fractionalRed = this.fractionalRed - 0.5;
        this.fractionalGreen = this.fractionalGreen - 0.5;
        this.fractionalBlue = this.fractionalBlue - 0.5;
        return this;
    }
    normalize() {
        return this.divide(this.getMagnitude());
    }
    add(other) {
        this.fractionalRed += other.fractionalRed;
        this.fractionalGreen += other.fractionalGreen;
        this.fractionalBlue += other.fractionalBlue;
        return this;
    }
    subtract(other) {
        this.fractionalRed -= other.fractionalRed;
        this.fractionalGreen -= other.fractionalGreen;
        this.fractionalBlue -= other.fractionalBlue;
        return this;
    }
    multiply(other) {
        if (other instanceof PixelRepresentation) {
            this.fractionalRed *= other.fractionalRed;
            this.fractionalGreen *= other.fractionalGreen;
            this.fractionalBlue *= other.fractionalBlue;
        }
        else {
            this.fractionalRed *= other;
            this.fractionalGreen *= other;
            this.fractionalBlue *= other;
        }
        return this;
    }
    divide(other) {
        if (other instanceof PixelRepresentation) {
            this.fractionalRed /= other.fractionalRed;
            this.fractionalGreen /= other.fractionalGreen;
            this.fractionalBlue /= other.fractionalBlue;
        }
        else {
            this.fractionalRed /= other;
            this.fractionalGreen /= other;
            this.fractionalBlue /= other;
        }
        return this;
    }
    power(value) {
        this.fractionalRed = Math.pow(this.fractionalRed, value);
        this.fractionalGreen = Math.pow(this.fractionalGreen, value);
        this.fractionalBlue = Math.pow(this.fractionalBlue, value);
        return this;
    }
    reflect(normal) {
        return this.subtract(normal.clone().multiply(this.getDotProduct(normal)).multiply(2));
    }
    clone() {
        return new PixelRepresentation(this._red, this._green, this._blue, this._alpha, true);
    }
}
/* VARIÁVEIS GLOBAIS */
// Estado e configurações
let renderingSettings;
let interfaceStatus; // TODO
let baseColorImage;
let specularMapImage;
let normalMapImage;
// Elementos da interface
let canvasElement;
let canvasContext;
let canvasBoundingRectangle;
let toastAlert;
/* INICIALIZAÇÃO */
(function () {
    canvasElement = document.getElementById('canvas-panel');
    canvasContext = canvasElement.getContext('2d');
    toastAlert = document.getElementById('toast-alert');
    configureInterface({
        directionalLightSourcePosition: new BidimensionalVector(0, 0),
        lightSourceColor: '#aaaaaa',
        showDiffuseComponent: true,
        showSpecularComponent: true
    });
})();
/* FUNÇÕES DA INTERFACE */
function presentToastAlert(message, warning = false) {
    const toastAlertContent = toastAlert.querySelector('#toast-alert-content');
    const toastAlertIcon = toastAlert.querySelector('sl-icon');
    toastAlertContent.textContent = message;
    if (warning) {
        toastAlert.setAttribute('type', 'warning');
        toastAlertIcon.setAttribute('name', 'exclamation-triangle');
    }
    else {
        toastAlert.setAttribute('type', 'primary');
        toastAlertIcon.setAttribute('name', 'info-circle');
    }
    setTimeout(() => {
        toastAlert.toast();
    }, 300);
}
function configureInterface(standardRenderingSettings) {
    renderingSettings = standardRenderingSettings;
    // FIXME: input event listeners
    document.getElementById('base-color-image-input').addEventListener('change', (event) => {
        const fileList = event.target.files;
        for (const file of fileList) {
            if (file.type && file.type.indexOf('image') === -1) {
                console.log('File is not an image.', file.type, file);
                return;
            }
            const reader = new FileReader();
            reader.addEventListener('load', (event) => __awaiter(this, void 0, void 0, function* () {
                baseColorImage = new Image();
                baseColorImage.src = event.target.result;
                baseColorImage.addEventListener('load', () => {
                    updateCanvas();
                });
            }));
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('specular-map-image-input').addEventListener('change', (event) => {
        const fileList = event.target.files;
        for (const file of fileList) {
            if (file.type && file.type.indexOf('image') === -1) {
                console.log('File is not an image.', file.type, file);
                return;
            }
            const reader = new FileReader();
            reader.addEventListener('load', (event) => __awaiter(this, void 0, void 0, function* () {
                specularMapImage = new Image();
                specularMapImage.src = event.target.result;
                specularMapImage.addEventListener('load', () => {
                    updateCanvas();
                });
            }));
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('normal-map-image-input').addEventListener('change', (event) => {
        const fileList = event.target.files;
        for (const file of fileList) {
            if (file.type && file.type.indexOf('image') === -1) {
                console.log('File is not an image.', file.type, file);
                return;
            }
            const reader = new FileReader();
            reader.addEventListener('load', (event) => __awaiter(this, void 0, void 0, function* () {
                normalMapImage = new Image();
                normalMapImage.src = event.target.result;
                normalMapImage.addEventListener('load', () => {
                    updateCanvas();
                });
            }));
            reader.readAsDataURL(file);
        }
    });
    const lightSourceColorPicker = document.getElementById('light-source-color-picker');
    const showDiffuseComponentSwitch = document.getElementById('show-diffuse-component-switch');
    const showSpecularComponentSwitch = document.getElementById('show-specular-component-switch');
    lightSourceColorPicker.value = renderingSettings.lightSourceColor;
    showDiffuseComponentSwitch.checked = renderingSettings.showDiffuseComponent;
    showSpecularComponentSwitch.checked = renderingSettings.showSpecularComponent;
    lightSourceColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.lightSourceColor = event.target.value;
        renderImage();
    });
    showDiffuseComponentSwitch.addEventListener('sl-change', (event) => {
        renderingSettings.showDiffuseComponent = event.target.checked;
        renderImage();
    });
    showSpecularComponentSwitch.addEventListener('sl-change', (event) => {
        renderingSettings.showSpecularComponent = event.target.checked;
        renderImage();
    });
    // function onLoadImage(event: Event, targetImageName: string) {
    //     const fileList: FileList = (event.target as any).files;
    //     for (const file of fileList) {
    //         if (file.type && file.type.indexOf('image') === -1) {
    //             presentToastAlert('O arquivo fornecido não é uma imagem válida.', true);
    //             return;
    //         }
    //         const reader = new FileReader();
    //         reader.addEventListener('load', async (event: Event) => {
    //             globalThis[targetImageName] = new Image();
    //             globalThis[targetImageName].src = (event.target as any).result;
    //             globalThis[targetImageName].addEventListener('load', () => {
    //                 updateCanvas();
    //             })
    //         });
    //         reader.readAsDataURL(file);
    //     }
    // }
    // document.getElementById('base-color-image-input').addEventListener('change', (event: Event) => {onLoadImage(event, 'baseColorImage')});
    // document.getElementById('specular-map-image-input').addEventListener('change', (event: Event) => {onLoadImage(event, 'specularMapImage')});
    // document.getElementById('normal-map-image-input').addEventListener('change', (event: Event) => {onLoadImage(event, 'normalMapImage')});
}
function selectDirectionalLightSourcePosition() {
    // TODO: InterfaceStatus != waitingForTextures
    let onMouseMove = (mouseMoveEvent) => {
        renderingSettings.directionalLightSourcePosition = getCanvasClickCoordinates(mouseMoveEvent);
        optimizedRenderImage();
    };
    let onMouseUp = () => {
        canvasElement.removeEventListener('mousemove', onMouseMove);
        canvasElement.removeEventListener('mouseup', onMouseUp);
    };
    let isRenderingImage = false;
    let optimizedRenderImage = function () {
        if (isRenderingImage) {
            return;
        }
        isRenderingImage = true;
        requestAnimationFrame(function () {
            renderImage();
            isRenderingImage = false;
        });
    };
    canvasElement.addEventListener('mousemove', onMouseMove);
    canvasElement.addEventListener('mouseup', onMouseUp);
}
function getCanvasClickCoordinates(event) {
    return new BidimensionalVector(event.clientX - canvasElement.getBoundingClientRect().left, event.clientY - canvasElement.getBoundingClientRect().top);
}
function loadSampleImages(imageName) {
    return __awaiter(this, void 0, void 0, function* () {
        // FIXME
        let baseColorBlob = yield fetch(`assets/sample-images/${imageName}_d.png`).then(result => result.blob());
        let specularMapBlob = yield fetch(`assets/sample-images/${imageName}_s.png`).then(result => result.blob());
        let normalMapBlob = yield fetch(`assets/sample-images/${imageName}_n.png`).then(result => result.blob());
    });
}
function updateCanvas() {
    const waitingForTexturesMessage = document.getElementById('waiting-for-textures-message');
    if (baseColorImage && specularMapImage && normalMapImage) {
        waitingForTexturesMessage.classList.add('hidden-element');
        canvasElement.classList.remove('hidden-element');
        canvasElement.width = baseColorImage.naturalWidth;
        canvasElement.height = baseColorImage.naturalHeight;
        canvasBoundingRectangle = canvasElement.getBoundingClientRect();
        renderImage();
    }
    else {
        waitingForTexturesMessage.classList.remove('hidden-element');
        canvasElement.classList.add('hidden-element');
    }
}
/* MANIPULAÇÃO DO CANVAS */
function renderImage() {
    canvasContext.clearRect(0, 0, baseColorImage.naturalWidth, baseColorImage.naturalHeight);
    canvasContext.drawImage(baseColorImage, 0, 0);
    let baseColorImageData = canvasContext.getImageData(0, 0, baseColorImage.naturalWidth, baseColorImage.naturalHeight);
    canvasContext.clearRect(0, 0, baseColorImage.naturalWidth, baseColorImage.naturalHeight);
    canvasContext.drawImage(specularMapImage, 0, 0);
    let specularMapImageData = canvasContext.getImageData(0, 0, specularMapImage.naturalWidth, specularMapImage.naturalHeight);
    canvasContext.clearRect(0, 0, baseColorImage.naturalWidth, baseColorImage.naturalHeight);
    canvasContext.drawImage(normalMapImage, 0, 0);
    let normalMapImageData = canvasContext.getImageData(0, 0, normalMapImage.naturalWidth, normalMapImage.naturalHeight);
    canvasContext.clearRect(0, 0, baseColorImage.naturalWidth, baseColorImage.naturalHeight);
    const finalImageData = calculateFinalImageData(baseColorImageData, specularMapImageData, normalMapImageData);
    canvasContext.putImageData(finalImageData, 0, 0);
}
function calculateFinalImageData(baseColorImageData, specularMapImageData, normalMapImageData) {
    const finalImageData = canvasContext.createImageData(baseColorImageData.width, baseColorImageData.height);
    const lightSourcePixelRepresentation = PixelRepresentation.fromHexadecimalColor(renderingSettings.lightSourceColor);
    const canvasSizeVector = new BidimensionalVector(baseColorImageData.width, baseColorImageData.height);
    const shininess = 200; // REVIEW
    for (const pixels of unwrapPixels(baseColorImageData, specularMapImageData, normalMapImageData)) {
        const ambientComponent = new PixelRepresentation(64, 64, 64, pixels.baseColorPixel.alpha, true);
        const N = pixels.normalMapPixel.clone().normalize();
        const L = renderingSettings.directionalLightSourcePosition
            .clone()
            .divide(canvasSizeVector)
            .subtract(pixels.coordinates.clone().divide(canvasSizeVector))
            .transformIntoPixelRepresentation();
        const V = pixels.coordinates.clone().divide(canvasSizeVector).invert().transformIntoPixelRepresentation(); // REVIEW: transformIntoPixelRepresentation
        const R = renderingSettings.directionalLightSourcePosition
            .clone()
            .divide(canvasSizeVector)
            .subtract(pixels.coordinates.clone().divide(canvasSizeVector))
            .divide(2)
            .invert()
            .transformIntoPixelRepresentation() // REVIEW
            .reflect(N);
        const diffuseComponent = pixels.baseColorPixel.clone().multiply(-N.getDotProduct(L)).multiply(lightSourcePixelRepresentation);
        const specularComponent = pixels.specularMapPixel.clone().multiply(Math.pow(R.getDotProduct(V), shininess));
        const finalPixelRepresentation = new PixelRepresentation(0, 0, 0, 255)
            .add(ambientComponent);
        if (renderingSettings.showDiffuseComponent) {
            finalPixelRepresentation.add(diffuseComponent);
        }
        if (renderingSettings.showSpecularComponent) {
            finalPixelRepresentation.add(specularComponent);
        }
        finalImageData.data[pixels.offset] = finalPixelRepresentation.red;
        finalImageData.data[pixels.offset + 1] = finalPixelRepresentation.green;
        finalImageData.data[pixels.offset + 2] = finalPixelRepresentation.blue;
        finalImageData.data[pixels.offset + 3] = finalPixelRepresentation.alpha;
    }
    return finalImageData;
}
function* unwrapPixels(baseColorImageData, specularMapImageData, normalMapImageData) {
    let offset = 0;
    let row = 0;
    while (offset < baseColorImageData.data.length) {
        const column = offset % (baseColorImageData.width * 4);
        if (column === 0) {
            row++;
        }
        const unwrappedPixels = {
            coordinates: new BidimensionalVector(row, column),
            baseColorPixel: new PixelRepresentation(baseColorImageData.data[offset], baseColorImageData.data[offset + 1], baseColorImageData.data[offset + 2], baseColorImageData.data[offset + 3], true),
            specularMapPixel: new PixelRepresentation(specularMapImageData.data[offset], specularMapImageData.data[offset + 1], specularMapImageData.data[offset + 2], specularMapImageData.data[offset + 3], true),
            normalMapPixel: new PixelRepresentation(normalMapImageData.data[offset], normalMapImageData.data[offset + 1], normalMapImageData.data[offset + 2], normalMapImageData.data[offset + 3], true),
            offset
        };
        offset += 4;
        yield unwrappedPixels;
    }
}
