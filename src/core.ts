
const DEFAULT_CHUNKSIZE = 1024 * 1024 * 2;
const DEFAULT_REMOVE_BUTTON = `<button class="filechunk-remove btn btn-primary" type="submit" value="LABEL">LABEL</button>`;
const DEFAULT_ITEM_TEMPLATE = `<li data-fid="FID"></li>`;
const TEMPLATE_ERROR_ZONE = `<div class="messages error file-upload-js-error" aria-live="polite" style="display: none;"></div>`;
const TEMPLATE_PROGRESS_BAR = `<div class="progressbar" role="progressbar" aria-valuenow="" aria-valuemin="0" aria-valuemax="100" style="display: none;"></div>`;

// From https://codepen.io/gapcode/pen/vEJNZN
function detectIE(): number | null {
    const userAgent = window.navigator.userAgent;
    const msie = userAgent.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(userAgent.substring(msie + 5, userAgent.indexOf('.', msie)), 10);
    }
    const trident = userAgent.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        const rv = userAgent.indexOf('rv:');
        return parseInt(userAgent.substring(rv + 3, userAgent.indexOf('.', rv)), 10);
    }
    return null;
}

function checkNumber(value: any, min?: number): number {
    if ("number" !== typeof value) {
        if ("string" === typeof value) {
            value = parseInt(value, 10);
            if (isNaN(value)) {
                throw `Invalid argument, number is not a number`;
            }
        } else {
            throw `Invalid argument, number is not a number`;
        }
    }
    if (min && value < min) {
        throw `Invalid argument, number must be over ${min}`;
    }
    return value;
}

class Item {
    readonly id: string;
    readonly filename: string;
    readonly hash: string | null;
    readonly preview: string | null;

    constructor(id: string, filename: string, hash?: string, preview?: string) {
        this.id = id;
        this.filename = filename;
        this.hash = hash || null;
        this.preview = hash || null;
    }
}

class FilechunkConfig {
    readonly token: string;
    readonly isMultiple: boolean;
    readonly chunksize: number;
    readonly maxCount: number;
    readonly uploadUrl: string;
    readonly removeUrl: string;
    readonly removeButtonTemplate: string = `<button class="filechunk-remove btn btn-primary" type="submit" value="Remove">' + Drupal.t( "Remove" ) + '</button>`;
    readonly itemPreviewTemplate: string = `<li data-fid="FID"></li>`;

    constructor(element: HTMLInputElement) {
        if (element.type !== "file") {
            throw "Input widget is not a file input";
        }
        if (!element.hasAttribute("data-token")) {
            throw "Input widget has no token set, file upload is not possible";
        }
        if (!element.hasAttribute("data-uri-upload")) {
            throw "Input widget has no upload url set, file upload is not possible";
        }
        if (!element.hasAttribute("data-uri-remove")) {
            throw "Input widget has no remove url set, file upload is not possible";
        }

        this.token = <string>element.getAttribute('data-token');
        this.isMultiple = element.multiple;
        this.chunksize = checkNumber(element.getAttribute('data-chunksize') || DEFAULT_CHUNKSIZE);
        this.maxCount = this.isMultiple ? (checkNumber(element.getAttribute('data-max-count')) || 1) : 1;
        this.uploadUrl = <string>element.getAttribute('data-uri-upload');
        this.removeUrl = <string>element.getAttribute('data-uri-remove');
        this.removeButtonTemplate = element.getAttribute( 'data-tpl-remove' ) || DEFAULT_REMOVE_BUTTON;
        this.itemPreviewTemplate = element.getAttribute( 'data-tpl-item' ) || DEFAULT_ITEM_TEMPLATE;
    }
}

export class FilechunkWidget {
    private config: FilechunkConfig;
    private currentValue: Item[] = [];
    private dropZone: HTMLElement;
    private errorElement: HTMLElement;
    private inputElement: HTMLInputElement;
    private isMSIE: boolean;
    private previewContainer: Element;
    private progressBar: HTMLElement;
    private translateCallback?: Translate;
    private valueElement: HTMLInputElement;
    private wrapper: HTMLElement;

    constructor(wrapper: HTMLElement, translate?: Translate) {
        if (!FileReader) {
            throw `Your browser is too old, file upload is not supported`;
        }

        if (!wrapper.parentElement) {
            throw `What?`;
        }
        wrapper = wrapper.parentElement;

        const inputElement = wrapper.querySelector("input[type=file]");
        if (!(inputElement instanceof HTMLInputElement)) {
            throw `Could not find the input[type=file] element`;
        }

        const valueElement = wrapper.querySelector("input[type=hidden]");
        if (!(valueElement instanceof HTMLInputElement)) {
            throw `Could not find the input[type=file] element`;
        }

        const dropZone = wrapper.querySelector(".filechunk-widget-drop");
        if (!(dropZone instanceof HTMLElement)) {
            throw `Could not find the drop zone`;
        }

        let previewContainer = wrapper.querySelector(".preview-thumbnail");
        if (!previewContainer) {
            previewContainer = <HTMLElement>document.createElement("ul");
            previewContainer.classList.add("preview-container");
            wrapper.appendChild(previewContainer);
        }

        // Config and environment
        this.config = new FilechunkConfig(inputElement);
        this.isMSIE = null !== detectIE();
        this.translateCallback = translate;

        // HTML elements
        this.wrapper = wrapper;
        this.dropZone = dropZone;
        this.inputElement = inputElement;
        this.previewContainer = previewContainer;
        this.valueElement = valueElement;
        this.errorElement = this.createElementFromString(TEMPLATE_ERROR_ZONE);
        this.dropZone.insertBefore(this.errorElement, this.dropZone.firstChild);
        this.progressBar = this.createElementFromString(TEMPLATE_PROGRESS_BAR);
        this.wrapper.insertBefore(this.progressBar, this.valueElement);

        // Just a few theming
        this.inputElement.style.opacity = "0";
        this.inputElement.style.position = "absolute";
        this.inputElement.style.top = "0";
        this.inputElement.style.left = "0";
        this.inputElement.style.bottom = "0";
        this.inputElement.style.right = "0";

        // If input is required, drop the attribute
        this.inputElement.required = false;

        // Parse initial values and set items and refresh widget state
        try {
            const valueAsString = this.valueElement.value;
            if (valueAsString && "" != valueAsString) {
                const defaultValues = JSON.parse(this.valueElement.value);
                for (let id in defaultValues) {
                    let value = defaultValues[id];
                    if ("object" === typeof value) { // Just ignore invalid input
                        this.currentValue.push(new Item(id, value.filename, value.hash, value.preview));
                    }
                }
            }
        } catch (error) {
            console.log(error);
            this.showError(this.translate("Invalid default value"));
        }
        this.refresh();

        this.inputElement.addEventListener("change", event => this.onUploadChangeListener(event));
        this.inputElement.addEventListener("drop", event => this.onUploadChangeListener(event));
    }

    private createElementFromString(text: string): HTMLElement {
        const placeholder = document.createElement("div");
        placeholder.innerHTML = text;
        if (!placeholder.firstElementChild) {
            throw `Invalid HTML input given, could not create element`;
        }
        return <HTMLElement>placeholder.firstElementChild;
    }

    private translate(text: string, variables?: any): string {
        if (this.translateCallback) {
            return this.translateCallback(text, variables);
        }
        let ret = text;
        for (let name in variables) {
            ret.replace(name, variables[name]);
        }
        return ret;
    }

    private showError(text: string) {
        this.errorElement.innerHTML = text;
        this.errorElement.style.display = "block";
    }

    private clearError() {
        this.errorElement.style.display = "none";
        this.errorElement.innerHTML = "";
    }

    private refresh() {
        const serialized: any = {};
        this.previewContainer.innerHTML = "";
        for (let item of this.currentValue) {
            const elementString = this.config.itemPreviewTemplate.replace("FID", item.id);
            const element = this.createElementFromString(elementString);
            element.innerHTML = item.filename || item.hash || item.id;
            const removeString = this.config.removeButtonTemplate.replace(/LABEL/g, this.translate("Remove"));
            const remove = this.createElementFromString(removeString);
            remove.addEventListener("click", (event: MouseEvent) => {
                event.stopPropagation();
                event.preventDefault();
                this.remoteRemoveCall(item.id).then(() => {
                    for (let index = 0; index < this.currentValue.length; ++index) {
                        if (this.currentValue[index].id == item.id) {
                            this.currentValue.splice(index, 1);
                        }
                    }
                    this.refresh();
                }).catch((error) => {
                    this.showError(error);
                    this.refresh();
                });
            });
            serialized[item.id] = {filename: item.filename, hash: item.hash};
            element.appendChild(remove);
            this.previewContainer.appendChild(element);
        }
        this.valueElement.value = JSON.stringify(serialized);
    }

    private updateProgress(percent: string | number, message?: string) {
        let percentage: string = percent.toString();
        this.progressBar.style.display = "block";
        message = message || percentage + "%";
        this.progressBar.style.width = percentage + "%";
        this.progressBar.innerHTML = message;
        this.progressBar.setAttribute("aria-valuenow", percent.toString());
    }

    private remoteRemoveCall(fileId: string): Promise<void> {
        return new Promise<any>((resolve: () => void) => {

            const req = new XMLHttpRequest();
            req.open('POST', this.config.removeUrl);
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            req.setRequestHeader("Accept", "application/json" );
            req.setRequestHeader("X-File-Id", fileId);
            req.setRequestHeader("X-File-Token", this.config.token);
            if (req.overrideMimeType) {
                req.overrideMimeType("application/octet-stream");
            }

            req.addEventListener("load", () => {
                resolve()
            });

            req.addEventListener("error", () => {
                throw `${req.status}: ${req.statusText}: ${req.responseText}`;
            });

            req.send();
        });
    }

    private remoteUploadCall(file: File, start: number, step: number): Promise<Item> {
        const stop = Math.min(start + step, file.size);

        return new Promise<Item>((resolve: (item: Item | Promise<Item>) => void, reject: (error: any) => void) => {
            const req = new XMLHttpRequest();
            req.open('POST', this.config.uploadUrl);
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            req.setRequestHeader("Accept", "application/json" );
            req.setRequestHeader("X-File-Name", btoa(encodeURIComponent(file.name)));
            req.setRequestHeader("Content-Range", "bytes " + start + "-" + stop + "/" + file.size);
            req.setRequestHeader('Content-type', 'application/octet-stream');
            req.setRequestHeader("X-File-Token", this.config.token);
            if (req.overrideMimeType) {
                req.overrideMimeType("application/octet-stream");
            }

            req.addEventListener("loadend", () => {
                try {
                    const response = JSON.parse(req.responseText);
                    if (200 !== req.status) {
                        throw response.message || `error: ${req.status} ${req.statusText}`;
                    } else {
                        if (file.size <= stop || response.finished) {
                            if (!response.fid || !response.hash) {
                                throw this.translate("File could not be completely uploaded");
                            }
                            this.updateProgress(100);
                            resolve(new Item(response.fid, file.name, response.hash, response.preview));
                        } else {
                            this.updateProgress(Math.round((<number>response.offset / file.size) * 100));
                            // Recursive promise execution
                            if (response.resume && response.offset) {
                                resolve(this.remoteUploadCall(file, response.offset, step));
                            } else {
                                resolve(this.remoteUploadCall(file, stop, step));
                            }
                        }
                    }
                } catch (error) {
                    // Promises don't catch asyncly throwed exceptions, since
                    // that we are working with and asynchronous XMLHttpRequest
                    // we must catch errors manually and reject() them.
                    reject(error);
                }
            });

            req.send(file.slice(start, stop));
        });
    }

    private replaceUpload() {
        // https://stackoverflow.com/a/16596041
        if (this.isMSIE) {
            const clone = <HTMLInputElement>this.inputElement.cloneNode(false);
            (<Element>this.inputElement.parentElement).replaceChild(clone, this.inputElement);
            this.inputElement = clone;
            this.inputElement.addEventListener("change", event => this.onUploadChangeListener(event));
            this.inputElement.addEventListener("drop", event => this.onUploadChangeListener(event));
        } else {
            this.inputElement.value = '';
        }
        this.progressBar.setAttribute("aria-valuenow", "0");
        this.progressBar.style.display = "none";
        this.refresh();
    }

    private onUploadChangeListener(event: Event) {

        const files = this.inputElement.files;
        if (!files || !files.length) { // No files
            this.replaceUpload();
            return;
        }

        if (this.config.maxCount && (Object.keys(this.currentValue).length + files.length) > this.config.maxCount) {
            this.showError(this.translate("A maximum of @count elements is allowed", {'@count': this.config.maxCount}));
            this.replaceUpload();
            return;
        }

        this.updateProgress(0);

        // Now the hard part.
        for (let i = 0; i < files.length; ++i) {
            let file: File = files[i];
            this.showError(this.translate("Uploading file @file...", {'@file': file.name}));

            this.remoteUploadCall(file, 0, this.config.chunksize).then(item => {
                this.currentValue.push(item);
                this.clearError();
                this.replaceUpload();
            }).catch(error => {
                this.showError(error);
                console.log(error);
                this.replaceUpload();
            });
        }
    }
}
