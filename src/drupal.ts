import './types/drupal';

import { FilechunkWidget } from "./core";

Drupal.behaviors.filechunk = {
    attach: (context: Element, settings: any) => {
        if (!context.querySelectorAll) {
            console.log(`Given context is not a valid HTML Element, some module are probably wrongly calling Drupal.attachBehavior() using a jQuery selector`);
            return;
        }
        for (let widget of <HTMLElement[]><any>context.querySelectorAll(".filechunk-widget-table")) {
            new FilechunkWidget(widget, Drupal.t);
        }
    }
};
