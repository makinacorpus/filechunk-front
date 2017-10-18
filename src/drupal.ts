import './types/drupal';

import { FilechunkWidget } from "./core";

Drupal.behaviors.filechunk = {
    attach: (context: Element, settings: any) => {
        for (let widget of <HTMLElement[]><any>context.querySelectorAll(".filechunk-widget-table")) {
            new FilechunkWidget(widget, Drupal.t);
        }
    }
};
