// Defines Drupal global

declare var Drupal: drupal.Drupal;

declare type Translate = (text: string, variables?: any) => string;

declare namespace drupal {
    interface Drupal {
        readonly behaviors: any;
        readonly t: Translate;
        attachBehaviors(element: Element): void;
    }
}
