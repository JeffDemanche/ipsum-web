import { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type ArcKeySpecifier = ('arcEntry' | 'color' | 'highlights' | 'history' | 'id' | 'incomingRelations' | 'name' | 'outgoingRelations' | ArcKeySpecifier)[];
export type ArcFieldPolicy = {
	arcEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	color?: FieldPolicy<any> | FieldReadFunction<any>,
	highlights?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	incomingRelations?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	outgoingRelations?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ArcEntryKeySpecifier = ('arc' | 'entry' | ArcEntryKeySpecifier)[];
export type ArcEntryFieldPolicy = {
	arc?: FieldPolicy<any> | FieldReadFunction<any>,
	entry?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommentKeySpecifier = ('commentEntry' | 'history' | 'id' | CommentKeySpecifier)[];
export type CommentFieldPolicy = {
	commentEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommentEntryKeySpecifier = ('comment' | 'entry' | CommentEntryKeySpecifier)[];
export type CommentEntryFieldPolicy = {
	comment?: FieldPolicy<any> | FieldReadFunction<any>,
	entry?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DayKeySpecifier = ('changedArcEntries' | 'comments' | 'day' | 'journalEntry' | 'srsCardReviews' | DayKeySpecifier)[];
export type DayFieldPolicy = {
	changedArcEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>,
	day?: FieldPolicy<any> | FieldReadFunction<any>,
	journalEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCardReviews?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EntryKeySpecifier = ('contentState' | 'date' | 'entryKey' | 'entryType' | 'highlights' | 'history' | 'trackedContentState' | EntryKeySpecifier)[];
export type EntryFieldPolicy = {
	contentState?: FieldPolicy<any> | FieldReadFunction<any>,
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	entryKey?: FieldPolicy<any> | FieldReadFunction<any>,
	entryType?: FieldPolicy<any> | FieldReadFunction<any>,
	highlights?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	trackedContentState?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HighlightKeySpecifier = ('arc' | 'arcs' | 'entry' | 'history' | 'id' | 'outgoingRelations' | 'srsCards' | HighlightKeySpecifier)[];
export type HighlightFieldPolicy = {
	arc?: FieldPolicy<any> | FieldReadFunction<any>,
	arcs?: FieldPolicy<any> | FieldReadFunction<any>,
	entry?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	outgoingRelations?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCards?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HistoryKeySpecifier = ('dateCreated' | HistoryKeySpecifier)[];
export type HistoryFieldPolicy = {
	dateCreated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JournalEntryKeySpecifier = ('entry' | 'entryKey' | JournalEntryKeySpecifier)[];
export type JournalEntryFieldPolicy = {
	entry?: FieldPolicy<any> | FieldReadFunction<any>,
	entryKey?: FieldPolicy<any> | FieldReadFunction<any>
};
export type JournalMetadataKeySpecifier = ('lastArcHue' | JournalMetadataKeySpecifier)[];
export type JournalMetadataFieldPolicy = {
	lastArcHue?: FieldPolicy<any> | FieldReadFunction<any>
};
export type QueryKeySpecifier = ('arc' | 'arcEntries' | 'arcEntry' | 'arcs' | 'entries' | 'entry' | 'entryKeys' | 'highlight' | 'highlights' | 'journalEntries' | 'journalEntry' | 'journalEntryDates' | 'journalEntryKeys' | 'journalId' | 'journalMetadata' | 'journalTitle' | 'recentEntries' | 'recentJournalEntries' | 'relation' | 'relations' | 'srsCard' | 'srsCardsForReview' | 'srsReviewsFromDay' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	arc?: FieldPolicy<any> | FieldReadFunction<any>,
	arcEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	arcEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	arcs?: FieldPolicy<any> | FieldReadFunction<any>,
	entries?: FieldPolicy<any> | FieldReadFunction<any>,
	entry?: FieldPolicy<any> | FieldReadFunction<any>,
	entryKeys?: FieldPolicy<any> | FieldReadFunction<any>,
	highlight?: FieldPolicy<any> | FieldReadFunction<any>,
	highlights?: FieldPolicy<any> | FieldReadFunction<any>,
	journalEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	journalEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	journalEntryDates?: FieldPolicy<any> | FieldReadFunction<any>,
	journalEntryKeys?: FieldPolicy<any> | FieldReadFunction<any>,
	journalId?: FieldPolicy<any> | FieldReadFunction<any>,
	journalMetadata?: FieldPolicy<any> | FieldReadFunction<any>,
	journalTitle?: FieldPolicy<any> | FieldReadFunction<any>,
	recentEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	recentJournalEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	relation?: FieldPolicy<any> | FieldReadFunction<any>,
	relations?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCard?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCardsForReview?: FieldPolicy<any> | FieldReadFunction<any>,
	srsReviewsFromDay?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RelationKeySpecifier = ('id' | 'object' | 'predicate' | 'subject' | RelationKeySpecifier)[];
export type RelationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	object?: FieldPolicy<any> | FieldReadFunction<any>,
	predicate?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SRSCardKeySpecifier = ('deck' | 'ef' | 'endDate' | 'id' | 'interval' | 'lastReviewed' | 'reviews' | 'subject' | 'subjectType' | SRSCardKeySpecifier)[];
export type SRSCardFieldPolicy = {
	deck?: FieldPolicy<any> | FieldReadFunction<any>,
	ef?: FieldPolicy<any> | FieldReadFunction<any>,
	endDate?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	interval?: FieldPolicy<any> | FieldReadFunction<any>,
	lastReviewed?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>,
	subjectType?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SRSCardReviewKeySpecifier = ('afterEF' | 'afterInterval' | 'beforeEF' | 'beforeInterval' | 'card' | 'day' | 'id' | 'rating' | SRSCardReviewKeySpecifier)[];
export type SRSCardReviewFieldPolicy = {
	afterEF?: FieldPolicy<any> | FieldReadFunction<any>,
	afterInterval?: FieldPolicy<any> | FieldReadFunction<any>,
	beforeEF?: FieldPolicy<any> | FieldReadFunction<any>,
	beforeInterval?: FieldPolicy<any> | FieldReadFunction<any>,
	card?: FieldPolicy<any> | FieldReadFunction<any>,
	day?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	rating?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SRSDeckKeySpecifier = ('cards' | 'id' | SRSDeckKeySpecifier)[];
export type SRSDeckFieldPolicy = {
	cards?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Arc?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ArcKeySpecifier | (() => undefined | ArcKeySpecifier),
		fields?: ArcFieldPolicy,
	},
	ArcEntry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ArcEntryKeySpecifier | (() => undefined | ArcEntryKeySpecifier),
		fields?: ArcEntryFieldPolicy,
	},
	Comment?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommentKeySpecifier | (() => undefined | CommentKeySpecifier),
		fields?: CommentFieldPolicy,
	},
	CommentEntry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | CommentEntryKeySpecifier | (() => undefined | CommentEntryKeySpecifier),
		fields?: CommentEntryFieldPolicy,
	},
	Day?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | DayKeySpecifier | (() => undefined | DayKeySpecifier),
		fields?: DayFieldPolicy,
	},
	Entry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | EntryKeySpecifier | (() => undefined | EntryKeySpecifier),
		fields?: EntryFieldPolicy,
	},
	Highlight?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HighlightKeySpecifier | (() => undefined | HighlightKeySpecifier),
		fields?: HighlightFieldPolicy,
	},
	History?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | HistoryKeySpecifier | (() => undefined | HistoryKeySpecifier),
		fields?: HistoryFieldPolicy,
	},
	JournalEntry?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JournalEntryKeySpecifier | (() => undefined | JournalEntryKeySpecifier),
		fields?: JournalEntryFieldPolicy,
	},
	JournalMetadata?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | JournalMetadataKeySpecifier | (() => undefined | JournalMetadataKeySpecifier),
		fields?: JournalMetadataFieldPolicy,
	},
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Relation?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | RelationKeySpecifier | (() => undefined | RelationKeySpecifier),
		fields?: RelationFieldPolicy,
	},
	SRSCard?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SRSCardKeySpecifier | (() => undefined | SRSCardKeySpecifier),
		fields?: SRSCardFieldPolicy,
	},
	SRSCardReview?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SRSCardReviewKeySpecifier | (() => undefined | SRSCardReviewKeySpecifier),
		fields?: SRSCardReviewFieldPolicy,
	},
	SRSDeck?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | SRSDeckKeySpecifier | (() => undefined | SRSDeckKeySpecifier),
		fields?: SRSDeckFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;