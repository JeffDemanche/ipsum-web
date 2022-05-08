/**
 * Interface that could be implemented by either a local storage persistence
 * strategy or by a server-side persistence strategy.
 */
export interface JournalState {}

export const emptyJournalState: JournalState = {};
