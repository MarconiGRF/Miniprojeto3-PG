/* DEFINIÇÕES DE TIPOS */

type UnwrappedPixels = {
    coordinates: BidimensionalVector,
    baseColorPixel: PixelRepresentation,
    specularMapPixel: PixelRepresentation,
    normalMapPixel: PixelRepresentation,
    offset: number
};
type RenderingSettings = {
    directionalLightSourcePosition: BidimensionalVector,
    lightSourceColor: string,
    showDiffuseComponent: boolean,
    showSpecularComponent: boolean
};
enum InterfaceStatus {
    waitingForTextures = 'waiting-for-textures',
    showingCanvasRendering = 'showing-canvas-rendering',
    selectingdirectionalLightSourcePosition = 'selecting-directional-light-source-position'
}

class BidimensionalVector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getDotProduct(other: BidimensionalVector) {
        return this.x * other.x + this.y * other.y;
    }

    getMagnitude() {
        const dotProduct = this.getDotProduct(this);
        return Math.sqrt(dotProduct);
    }

    normalize() {
        return this.divide(this.getMagnitude());
    }

    divide(other: number | BidimensionalVector) {
        if (other instanceof BidimensionalVector) {
            this.x /= other.x;
            this.y /= other.y;
        } else  {
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

    subtract(other: BidimensionalVector) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    transformIntoPixelRepresentation() {
        return new PixelRepresentation(this.x, this.y, 1, 1, false, true)
    }
}
class PixelRepresentation {
    private _red: number;
    private _green: number;
    private _blue: number;
    private _alpha: number;

    get red() {
        return this._red;
    }

    get green() {
        return this._green;
    }
    
    get blue() {
        return this._blue;
    };

    get alpha() {
        return this._alpha;
    };

    set red(value: number) {
        this._red = Math.min(Math.max(-255, value), 255)
    }

    set green(value: number) {
        this._green = Math.min(Math.max(-255, value), 255)
    }
    
    set blue(value: number) {
        this._blue = Math.min(Math.max(-255, value), 255)
    };

    set alpha(value: number) {
        this._alpha = Math.min(Math.max(-255, value), 255)
    };

    get fractionalRed() {
        return this.red / 255;
    }

    get fractionalGreen() {
        return this.green / 255
    }
    
    get fractionalBlue() {
        return this.blue / 255;
    };

    get fractionalAlpha() {
        return this.alpha / 255;
    };

    set fractionalRed(value: number) {
        this.red = Math.round(value * 255);
    }

    set fractionalGreen(value: number) {
        this.green = Math.round(value * 255);
    }
    
    set fractionalBlue(value: number) {
        this.blue = Math.round(value * 255);
    };

    set fractionalAlpha(value: number) {
        this.alpha = Math.round(value * 255);
    };

    constructor(red: number, green: number, blue: number, alpha: number, skipChecks = false, isFractional = false) {
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
        } else {
            this.red = red;
            this.green = green;
            this.blue = blue;
            this.alpha = alpha;
        }
    }

    static fromHexadecimalColor(hexadecimalColor: string) {
        const red = parseInt(hexadecimalColor.slice(1, 3), 16);
        const green = parseInt(hexadecimalColor.slice(3, 5), 16);
        const blue = parseInt(hexadecimalColor.slice(5, 7), 16);
        const alpha = 255;
        return new PixelRepresentation(red, green, blue, alpha, true);
    }

    getDotProduct(other: PixelRepresentation) {
        return this.fractionalRed * other.fractionalRed + this.fractionalGreen * other.fractionalGreen + this.fractionalRed * other.fractionalRed;
    }

    getMagnitude() {
        const dotProduct = this.getDotProduct(this);
        return Math.sqrt(dotProduct);
    }

    centerize() {
        this.fractionalRed = this.fractionalRed - 0.5;
        this.fractionalGreen = this.fractionalGreen - 0.5;
        this.fractionalBlue =this.fractionalBlue - 0.5;
        return this;
    }

    normalize() {
        return this.divide(this.getMagnitude());
    }

    add(other: PixelRepresentation) {
        this.fractionalRed += other.fractionalRed;
        this.fractionalGreen += other.fractionalGreen;
        this.fractionalBlue += other.fractionalBlue;
        return this;
    }

    subtract(other: PixelRepresentation) {
        this.fractionalRed -= other.fractionalRed;
        this.fractionalGreen -= other.fractionalGreen;
        this.fractionalBlue -= other.fractionalBlue;
        return this;
    }

    multiply(other: PixelRepresentation | number) {
        if (other instanceof PixelRepresentation) {
            this.fractionalRed *= other.fractionalRed;
            this.fractionalGreen *= other.fractionalGreen;
            this.fractionalBlue *= other.fractionalBlue;
        } else {
            this.fractionalRed *= other;
            this.fractionalGreen *= other;
            this.fractionalBlue *= other;
        }

        return this;
    }

    divide(other: PixelRepresentation | number) {
        if (other instanceof PixelRepresentation) {
            this.fractionalRed /= other.fractionalRed;
            this.fractionalGreen /= other.fractionalGreen;
            this.fractionalBlue /= other.fractionalBlue;
        } else {
            this.fractionalRed /= other;
            this.fractionalGreen /= other;
            this.fractionalBlue /= other;
        }

        return this;
    }
    
    power(value: number) {
        this.fractionalRed = Math.pow(this.fractionalRed, value);
        this.fractionalGreen = Math.pow(this.fractionalGreen, value);
        this.fractionalBlue = Math.pow(this.fractionalBlue, value);
        return this;
    }

    reflect(normal: PixelRepresentation) {
        return this.subtract(
            normal.clone().multiply(
                this.getDotProduct(normal)
            ).multiply(2)
        )
    }

    clone() {
        return new PixelRepresentation(this._red, this._green, this._blue, this._alpha, true);
    }

}

/* VARIÁVEIS GLOBAIS */

// Estado e configurações
let renderingSettings: RenderingSettings;
let interfaceStatus: InterfaceStatus;
let waitingForTexturesMessage: HTMLParagraphElement;
let baseColorImage: HTMLImageElement;
let specularMapImage: HTMLImageElement;
let normalMapImage: HTMLImageElement;

// Elementos da interface
let canvasElement: HTMLCanvasElement;
let canvasContext: CanvasRenderingContext2D;
let canvasBoundingRectangle: DOMRect;
let toastAlert: HTMLElement;

/* INICIALIZAÇÃO */

(function() {

    canvasElement = document.getElementById('canvas-panel') as HTMLCanvasElement;
    canvasContext = canvasElement.getContext('2d');
    toastAlert = document.getElementById('toast-alert');
    waitingForTexturesMessage = document.getElementById('waiting-for-textures-message') as HTMLParagraphElement;

    interfaceStatus = InterfaceStatus.waitingForTextures;

    configureInterface({
        directionalLightSourcePosition: new BidimensionalVector(0, 0),
        lightSourceColor: '#aaaaaa',
        showDiffuseComponent: true,
        showSpecularComponent: true
    })
    
})();

/* FUNÇÕES DA INTERFACE */

function presentToastAlert(message: string, warning: boolean = false) {
    const toastAlertContent = toastAlert.querySelector('#toast-alert-content');
    const toastAlertIcon = toastAlert.querySelector('sl-icon');
    toastAlertContent.textContent = message;

    if (warning) {
        toastAlert.setAttribute('type', 'warning'); 
        toastAlertIcon.setAttribute('name', 'exclamation-triangle');
    } else {
        toastAlert.setAttribute('type', 'primary');
        toastAlertIcon.setAttribute('name', 'info-circle');
    }

    setTimeout(() => {
        (toastAlert as any).toast();
    }, 300)
}

function configureInterface(standardRenderingSettings: RenderingSettings) {

    renderingSettings = standardRenderingSettings;

    document.getElementById('base-color-image-input').addEventListener('change', (event: Event) => {
        const fileList: FileList = (event.target as any).files;
        for (const file of fileList) {
            if (file.type && file.type.indexOf('image') === -1) {
                console.log('File is not an image.', file.type, file);
                return;
            }
            
            const reader = new FileReader();
            reader.addEventListener('load', async (event: Event) => {
                baseColorImage = new Image();
                baseColorImage.src = (event.target as any).result;
                baseColorImage.addEventListener('load', () => {
                    updateCanvas();
                })

            });
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('specular-map-image-input').addEventListener('change', (event: Event) => {
        const fileList: FileList = (event.target as any).files;
        for (const file of fileList) {
            if (file.type && file.type.indexOf('image') === -1) {
                console.log('File is not an image.', file.type, file);
                return;
            }
            
            const reader = new FileReader();
            reader.addEventListener('load', async (event: Event) => {
                specularMapImage = new Image();
                specularMapImage.src = (event.target as any).result;
                specularMapImage.addEventListener('load', () => {
                    updateCanvas();
                })

            });
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('normal-map-image-input').addEventListener('change', (event: Event) => {
        const fileList: FileList = (event.target as any).files;
        for (const file of fileList) {
            if (file.type && file.type.indexOf('image') === -1) {
                console.log('File is not an image.', file.type, file);
                return;
            }
            
            const reader = new FileReader();
            reader.addEventListener('load', async (event: Event) => {
                normalMapImage = new Image();
                normalMapImage.src = (event.target as any).result;
                normalMapImage.addEventListener('load', () => {
                    updateCanvas();
                })

            });
            reader.readAsDataURL(file);
        }
    });

    const lightSourceColorPicker: any =  document.getElementById('light-source-color-picker');

    const showDiffuseComponentSwitch: any = document.getElementById('show-diffuse-component-switch');
    const showSpecularComponentSwitch: any = document.getElementById('show-specular-component-switch');

    lightSourceColorPicker.value = renderingSettings.lightSourceColor;

    showDiffuseComponentSwitch.checked = renderingSettings.showDiffuseComponent;
    showSpecularComponentSwitch.checked = renderingSettings.showSpecularComponent;

    lightSourceColorPicker.addEventListener('sl-change', (event) => {
        renderingSettings.lightSourceColor = event.target.value;
        if (interfaceStatus !== InterfaceStatus.waitingForTextures) {
            renderImage()
        }
    })

    showDiffuseComponentSwitch.addEventListener('sl-change', (event) => {
        renderingSettings.showDiffuseComponent = event.target.checked;
        if (interfaceStatus !== InterfaceStatus.waitingForTextures) {
            renderImage()
        }
    });

    showSpecularComponentSwitch.addEventListener('sl-change', (event) => {
        renderingSettings.showSpecularComponent = event.target.checked;
        if (interfaceStatus !== InterfaceStatus.waitingForTextures) {
            renderImage()
        }
    });
}

function selectDirectionalLightSourcePosition() {
    
    if (interfaceStatus === InterfaceStatus.waitingForTextures) {
        return;
    }

    let selectHoveredPosition = (mouseMoveEvent: MouseEvent) => {
        renderingSettings.directionalLightSourcePosition = getCanvasClickCoordinates(mouseMoveEvent);
        optimizedRenderImage();
    }

    let endSelection = () => {
        canvasElement.removeEventListener('mousemove', selectHoveredPosition);
        canvasElement.removeEventListener('mouseup', endSelection);
        // TODO: alterar a interfaceStatus para texture
    }

    if (interfaceStatus === InterfaceStatus.selectingdirectionalLightSourcePosition) {
        endSelection();
    }

    let isRenderingImage = false;

    let optimizedRenderImage = function() {
        if (isRenderingImage) {
            return;
        }
        isRenderingImage = true;
        requestAnimationFrame(function() {
            renderImage();
            isRenderingImage = false;
        });
    };

    // TODO: alterar a interfaceStatus para selecting 
    canvasElement.addEventListener('mousemove', selectHoveredPosition);
    canvasElement.addEventListener('mouseup', endSelection);
}

function getCanvasClickCoordinates(event: MouseEvent): BidimensionalVector {
    return new BidimensionalVector(
        event.clientX - canvasElement.getBoundingClientRect().left,
        event.clientY - canvasElement.getBoundingClientRect().top
        );
}

function loadSampleImages(imageName: string) {

    const sampleImagesPath = 'assets/sample-images';

    const baseColorImagePromise = new Promise((resolve, reject) => {
        baseColorImage = new Image();
        baseColorImage.src = `${sampleImagesPath}/${imageName}_d.png`;
        baseColorImage.addEventListener('load', () => {
            resolve();
        });
    })

    const specularMapImagePromise = new Promise((resolve, reject) => {
        specularMapImage = new Image();
        specularMapImage.src = `${sampleImagesPath}/${imageName}_s.png`;
        specularMapImage.addEventListener('load', () => {
            resolve();
        });
    })

    const normalMapImagePromise = new Promise((resolve, reject) => {
        normalMapImage = new Image();
        normalMapImage.src = `${sampleImagesPath}/${imageName}_n.png`;
        normalMapImage.addEventListener('load', () => {
            resolve();
        });
    });

    Promise.all([baseColorImagePromise, specularMapImagePromise, normalMapImagePromise]).then(() => {
        updateCanvas();
    })

}

function updateCanvas() {

    let nextInterfaceStatus: InterfaceStatus; 

    if (baseColorImage && specularMapImage && normalMapImage) {
        if (interfaceStatus === InterfaceStatus.selectingdirectionalLightSourcePosition) {
            return;
        }
        nextInterfaceStatus = InterfaceStatus.showingCanvasRendering;
    } else {
        nextInterfaceStatus = InterfaceStatus.waitingForTextures;
    }

    const updateTo = {}

    updateTo[InterfaceStatus.waitingForTextures] = () => {
        waitingForTexturesMessage.classList.remove('hidden-element');
        canvasElement.classList.add('hidden-element');
    }
    
    updateTo[InterfaceStatus.showingCanvasRendering] = () => {
        waitingForTexturesMessage.classList.add('hidden-element');
        canvasElement.classList.remove('hidden-element');

        canvasElement.width = baseColorImage.naturalWidth;
        canvasElement.height = baseColorImage.naturalHeight;
        
        canvasBoundingRectangle = canvasElement.getBoundingClientRect();
        
        renderImage();
    }

    if (interfaceStatus !== nextInterfaceStatus || nextInterfaceStatus === InterfaceStatus.showingCanvasRendering) {
        updateTo[nextInterfaceStatus]();
        interfaceStatus = nextInterfaceStatus;
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

function calculateFinalImageData(baseColorImageData: ImageData, specularMapImageData: ImageData, normalMapImageData: ImageData): ImageData {
    const finalImageData = canvasContext.createImageData(baseColorImageData.width, baseColorImageData.height);
    const lightSourcePixelRepresentation = PixelRepresentation.fromHexadecimalColor(renderingSettings.lightSourceColor);
    const canvasSizeVector = new BidimensionalVector(baseColorImageData.width, baseColorImageData.height);

    const shininess = 200; // REVIEW

    for (const pixels of unwrapPixels(baseColorImageData, specularMapImageData, normalMapImageData)) {

        const ambientComponent = new PixelRepresentation(64, 64, 64, pixels.baseColorPixel.alpha, true)
        
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
            .add(ambientComponent)

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

function* unwrapPixels(baseColorImageData: ImageData, specularMapImageData: ImageData, normalMapImageData: ImageData) {
    let offset = 0;
    let row = 0;
    
    while (offset < baseColorImageData.data.length) {
        const column = offset % (baseColorImageData.width * 4);
        
        if (column === 0) {
            row++;
        }

        const unwrappedPixels: UnwrappedPixels = {
            coordinates: new BidimensionalVector(row, column),
            baseColorPixel: new PixelRepresentation(
                baseColorImageData.data[offset],
                baseColorImageData.data[offset + 1],
                baseColorImageData.data[offset + 2],
                baseColorImageData.data[offset + 3],
                true
                ),
            specularMapPixel: new PixelRepresentation(
                specularMapImageData.data[offset],
                specularMapImageData.data[offset + 1],
                specularMapImageData.data[offset + 2],
                specularMapImageData.data[offset + 3],
                true
                ),
            normalMapPixel: new PixelRepresentation(
                normalMapImageData.data[offset],
                normalMapImageData.data[offset + 1],
                normalMapImageData.data[offset + 2],
                normalMapImageData.data[offset + 3],
                true
                ),
            offset
        }
        offset += 4;
        yield unwrappedPixels;
    }
}
