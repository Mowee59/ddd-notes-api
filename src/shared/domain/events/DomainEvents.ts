import { IDomainEvent } from "./IDomainEvent";
import { AggregateRoot } from "../AggregateRoot";
import { UniqueEntityID } from "../UniqueEntityID";

/**
 * @description DomainEvents class handles the registration, storage and dispatching of domain events
 * across aggregate roots in the domain layer.
 */
export class DomainEvents {
  /** @private Map of event class names to their handler functions */
  private static handlersMap = {};
  
  /** @private List of aggregate roots that have pending events to be dispatched */
  private static markedAggregates: AggregateRoot<any>[] = [];

  /**
   * @method markAggregateForDispatch
   * @description Marks an aggregate root for event dispatch. Called by aggregate root objects that have 
   * created domain events to eventually be dispatched when the infrastructure commits the unit of work.
   * @param {AggregateRoot<any>} aggregate - The aggregate root containing domain events
   */
  public static markAggregateForDispatch (aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  /**
   * @method dispatchAggregateEvents
   * @description Dispatches all domain events for a given aggregate root
   * @param {AggregateRoot<any>} aggregate - The aggregate root containing events to dispatch
   * @private
   */
  private static dispatchAggregateEvents (aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: IDomainEvent) => this.dispatch(event));
  }

  /**
   * @method removeAggregateFromMarkedDispatchList
   * @description Removes an aggregate root from the marked dispatch list after its events are processed
   * @param {AggregateRoot<any>} aggregate - The aggregate root to remove
   * @private
   */
  private static removeAggregateFromMarkedDispatchList (aggregate: AggregateRoot<any>): void {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    this.markedAggregates.splice(index, 1);
  }

  /**
   * @method findMarkedAggregateByID
   * @description Finds a marked aggregate root by its ID
   * @param {UniqueEntityID} id - The unique identifier to search for
   * @returns {AggregateRoot<any>} The found aggregate root or null if not found
   * @private
   */
  private static findMarkedAggregateByID (id: UniqueEntityID): AggregateRoot<any> {
    let found: AggregateRoot<any> = null;
    for (let aggregate of this.markedAggregates) {
      if (aggregate.id.equals(id)) {
        found = aggregate;
      }
    }

    return found;
  }

  /**
   * @method dispatchEventsForAggregate
   * @description Dispatches all events for an aggregate root identified by the given ID
   * @param {UniqueEntityID} id - The unique identifier of the aggregate root
   */
  public static dispatchEventsForAggregate (id: UniqueEntityID): void {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  /**
   * @method register
   * @description Registers an event handler callback for a specific event class
   * @param {Function} callback - The function to be called when the event is dispatched
   * @param {string} eventClassName - The class name of the event to handle
   */
  public static register(callback: (event: IDomainEvent) => void, eventClassName: string): void {
    if (!this.handlersMap.hasOwnProperty(eventClassName)) {
      this.handlersMap[eventClassName] = [];
    }
    this.handlersMap[eventClassName].push(callback);
  }

  /**
   * @method clearHandlers
   * @description Clears all registered event handlers
   */
  public static clearHandlers(): void {
    this.handlersMap = {};
  }

  /**
   * @method clearMarkedAggregates
   * @description Clears all marked aggregates waiting for dispatch
   */
  public static clearMarkedAggregates(): void {
    this.markedAggregates = [];
  }

  /**
   * @method dispatch
   * @description Dispatches a single domain event to all registered handlers
   * @param {IDomainEvent} event - The domain event to dispatch
   * @private
   */
  private static dispatch (event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name;

    if (this.handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: any[] = this.handlersMap[eventClassName];
      for (let handler of handlers) {
        handler(event);
      }
    }
  }
}