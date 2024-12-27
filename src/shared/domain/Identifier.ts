/**
 * Generic identifier class that wraps a value of type T
 * Used as a base class for domain entity identifiers
 */
export class Identifier<T> {
  /**
   * Creates a new identifier
   * @param value The value to wrap
   */
  constructor(private value: T) {
    this.value = value;
  }

  /**
   * Checks if this identifier equals another identifier
   * @param id The identifier to compare with
   * @returns True if the identifiers are equal, false otherwise
   */
  equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  /**
   * Returns string representation of the identifier
   * @returns String value of the wrapped identifier
   */
  toString() {
    return String(this.value);
  }

  /**
   * Returns the raw value of the identifier
   * @returns The wrapped value of type T
   */
  toValue(): T {
    return this.value;
  }
}
