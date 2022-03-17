/* eslint-disable @typescript-eslint/ban-types */
import { type } from 'os';

export interface Subscription {
  // Cancels the subscription
  unsubscribe(): void;

  // A boolean value indicating whether the subscription is closed
  get closed(): boolean;
}

export type SubscriberFunction = (
  observer: SubscriptionObserver
) => () => void | Subscription;

export interface Observer {
  // Receives the subscription object when `subscribe` is called
  start(subscription: Subscription): unknown;

  // Receives the next value in the sequence
  next(value: any): void;

  // Receives the sequence error
  error(errorValue: any): void;

  // Receives a completion notification
  complete(): void;
}

export interface SubscriptionObserver {
  // Sends the next value in the sequence
  next(value: unknown): void;

  // Sends the sequence error
  error(errorValue: unknown): void;

  // Sends the completion notification
  complete(): void;

  // A boolean value indicating whether the subscription is closed
  get closed(): boolean;
}

export interface Observable {
  // Subscribes to the sequence with an observer
  subscribe(observer: Observer): Subscription;

  // Subscribes to the sequence with callbacks
  subscribe(
    onNext: Function,
    onError?: Function,
    onComplete?: Function
  ): Subscription;

  // Returns itself
  [Symbol.observable](): Observable;
}
