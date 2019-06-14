
import { Context, Item, Translate, UpdateProgress, upload } from "./upload";

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

class FilechunkConfig implements Context {
    readonly chunksize: number;
    readonly endpoint: string;
    readonly fieldname: string;
    readonly isMultiple: boolean;
    readonly itemPreviewTemplate: string = `<li data-fid="FID"></li>`;
    readonly maxCount: number;
    readonly onUpdate?: UpdateProgress;
    readonly removeButtonTemplate: string = `<button class="filechunk-remove btn btn-primary" type="submit" value="Remove">' + Drupal.t( "Remove" ) + '</button>`;
    readonly removeUrl: string;
    readonly token: string;

    constructor(element: HTMLInputElement, onUpdate?: UpdateProgress) {
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

        // Avoid the widget to crash in case there's a wrong data-max-count
        // value - fallback on 1 when ensure: avoid sending many files wrongly
        // to server.
        const maxCountRaw = element.getAttribute('data-max-count');
        if (maxCountRaw) {
            try {
                this.maxCount = checkNumber(maxCountRaw);
            } catch (err) {
                console.log(err);
                this.maxCount = 1;
            }
        } else if (element.multiple) {
            this.maxCount = 0;
        } else {
            this.maxCount = 1;
        }

        this.chunksize = checkNumber(element.getAttribute('data-chunksize') || DEFAULT_CHUNKSIZE);
        this.endpoint = <string>element.getAttribute('data-uri-upload');
        this.fieldname = <string>element.getAttribute('data-field-name');
        this.isMultiple = element.multiple;
        this.itemPreviewTemplate = element.getAttribute( 'data-tpl-item' ) || DEFAULT_ITEM_TEMPLATE;
        this.onUpdate = onUpdate;
        this.removeButtonTemplate = element.getAttribute( 'data-tpl-remove' ) || DEFAULT_REMOVE_BUTTON;
        this.removeUrl = <string>element.getAttribute('data-uri-remove');
        this.token = <string>element.getAttribute('data-token');
    }
}

export class FilechunkWidget {
    private config: FilechunkConfig;
    private currentValue: Item[] = [];
    private dropZone: HTMLElement;
    private errorElement: HTMLElement;
    private inputElement: HTMLInputElement;
    private isMSIE: boolean;
    private previewContainer: HTMLElement;
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

        let previewContainer = wrapper.querySelector(".preview-container") as HTMLElement;
        if (!previewContainer) {
            previewContainer = document.createElement("ul") as HTMLElement;
            previewContainer.style.display = "none";
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
                    if ("object" === typeof value) {
                        // Drupal code, values are objects containing various
                        // information we just have to position at the right
                        // place.
                        this.currentValue.push(new Item(id, value.filename, value.hash, value.preview));
                    } else {
                        // Symfony code, we do not always have a file identifie
                        // rather a filename and a checksum instead, case in
                        // which keys are filenames instead of identifiers and
                        // values are file checkum strings instead of a value
                        // object.
                        this.currentValue.push(new Item(value, id, value));
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
        let count = 0;
        this.previewContainer.innerHTML = "";

        for (let item of this.currentValue) {
            count++;

            // Create single value display.
            const elementString = this.config.itemPreviewTemplate.replace("FID", item.id);
            const element = this.createElementFromString(elementString);
            element.innerHTML = item.filename || item.hash || item.id;

            // Append remove button.
            const removeString = this.config.removeButtonTemplate.replace(/LABEL/g, this.translate("Remove"));
            const remove = this.createElementFromString(removeString);

            // Remove button behaviour.
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

            // Rebuild item list for hidden value input.
            serialized[item.id] = {filename: item.filename, hash: item.hash};

            element.appendChild(remove);
            this.previewContainer.appendChild(element);
        }

        if (count) {
            this.previewContainer.style.display = "block";
        } else {
            this.previewContainer.style.display = "none";
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
            if (!/^[1-9]+$/.test(fileId)) {
                // Under certain conditions (i.e. the file not having been
                // persisted yet) the fileId is the complete filename (which
                // is wrong somehow) but in this case it triggers the infamous:
                // "TypeError: Failed to execute 'setRequestHeader' on 'XMLHttpRequest': Value is not a valid ByteString."
                // error, let's avoid front side crashing in those cases.
                // This, of course, will only happen in Apple and Windows OS's,
                // with files that carry broken UTF-8 characters in their names,
                // I hate users that always name their files with broken charsets.
                req.setRequestHeader("X-File-Id", btoa(encodeURIComponent(fileId)));
            } else {
                req.setRequestHeader("X-File-Id", fileId);
            }
            req.setRequestHeader("X-File-Token", this.config.token);
            req.setRequestHeader("X-File-field", this.config.fieldname);
            if (req.overrideMimeType) {
                req.overrideMimeType("application/octet-stream");
            }

            req.addEventListener("load", () => {
                resolve();
            });

            req.addEventListener("error", () => {
                throw `${req.status}: ${req.statusText}: ${req.responseText}`;
            });

            req.send();
        });
    }

    private replaceUpload() {
        // https://stackoverflow.com/a/16596041
        if (this.isMSIE) {
            const clone = this.inputElement.cloneNode(false) as HTMLInputElement;
            (this.inputElement.parentElement as Element).replaceChild(clone, this.inputElement);
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
            if (this.config.maxCount < 2) {
                this.showError(this.translate("Only one element is allowed"));
            } else {
                this.showError(this.translate("A maximum of @count elements is allowed", {'@count': this.config.maxCount}));
            }
            this.replaceUpload();
            return;
        }

        this.updateProgress(0);

        // Now the hard part.
        for (let i = 0; i < files.length; ++i) {
            let file: File = files[i];
            this.showError(this.translate("Uploading file @file...", {'@file': file.name}));

            upload(file, this.config).then(item => {
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
