
export type UpdateProgress = (percent: string | number, message?: string) => void;
export type Translate = (text: string, variables?: any) => string;

export interface Context {
    readonly chunksize: number;
    readonly endpoint: string;
    readonly fieldname?: string;
    readonly onUpdate?: UpdateProgress;
    readonly token: string;
}

export class Item {
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

function remoteUploadCall(file: File, context: Context, start: number = 0): Promise<Item> {
    const step = context.chunksize;
    const stop = Math.min(start + step, file.size);

    return new Promise<Item>((resolve: (item: Item | Promise<Item>) => void, reject: (error: any) => void) => {
        const req = new XMLHttpRequest();
        req.open('POST', context.endpoint);
        req.setRequestHeader("Accept", "application/json" );
        req.setRequestHeader("Content-Range", "bytes " + start + "-" + stop + "/" + file.size);
        req.setRequestHeader("Content-type", 'application/octet-stream');
        req.setRequestHeader("X-File-field", context.fieldname || "none");
        req.setRequestHeader("X-File-Name", btoa(encodeURIComponent(file.name)));
        req.setRequestHeader("X-File-Token", context.token);
        req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
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
                            throw "File could not be completely uploaded";
                        }
                        if (context.onUpdate) {
                            context.onUpdate(100);
                        }
                        resolve(new Item(response.fid, file.name, response.hash, response.preview));
                    } else {
                        if (context.onUpdate) {
                            const offset = response.offset as number;
                            context.onUpdate(Math.round(offset / file.size) * 100);
                        }
                        // Recursive promise execution
                        if (response.resume && response.offset) {
                            resolve(remoteUploadCall(file, context, response.offset));
                        } else {
                            resolve(remoteUploadCall(file, context, stop));
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

export function upload(file: File, context: Context): Promise<Item> {
    return remoteUploadCall(file, context);
}
