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
export type CommentKeySpecifier = ('commentEntry' | 'highlight' | 'history' | 'id' | 'parent' | CommentKeySpecifier)[];
export type CommentFieldPolicy = {
	commentEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	highlight?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	parent?: FieldPolicy<any> | FieldReadFunction<any>
};
export type CommentEntryKeySpecifier = ('comment' | 'entry' | CommentEntryKeySpecifier)[];
export type CommentEntryFieldPolicy = {
	comment?: FieldPolicy<any> | FieldReadFunction<any>,
	entry?: FieldPolicy<any> | FieldReadFunction<any>
};
export type DayKeySpecifier = ('changedArcEntries' | 'comments' | 'day' | 'hasJournalEntry' | 'journalEntry' | 'ratedHighlights' | 'srsCardsReviewed' | DayKeySpecifier)[];
export type DayFieldPolicy = {
	changedArcEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>,
	day?: FieldPolicy<any> | FieldReadFunction<any>,
	hasJournalEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	journalEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	ratedHighlights?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCardsReviewed?: FieldPolicy<any> | FieldReadFunction<any>
};
export type EntryKeySpecifier = ('date' | 'entryKey' | 'entryType' | 'highlights' | 'history' | 'htmlString' | 'trackedHTMLString' | EntryKeySpecifier)[];
export type EntryFieldPolicy = {
	date?: FieldPolicy<any> | FieldReadFunction<any>,
	entryKey?: FieldPolicy<any> | FieldReadFunction<any>,
	entryType?: FieldPolicy<any> | FieldReadFunction<any>,
	highlights?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	htmlString?: FieldPolicy<any> | FieldReadFunction<any>,
	trackedHTMLString?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HighlightKeySpecifier = ('arc' | 'arcs' | 'comments' | 'currentImportance' | 'entry' | 'excerpt' | 'history' | 'hue' | 'id' | 'importanceRatings' | 'number' | 'object' | 'objectText' | 'outgoingRelations' | 'srsCard' | HighlightKeySpecifier)[];
export type HighlightFieldPolicy = {
	arc?: FieldPolicy<any> | FieldReadFunction<any>,
	arcs?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>,
	currentImportance?: FieldPolicy<any> | FieldReadFunction<any>,
	entry?: FieldPolicy<any> | FieldReadFunction<any>,
	excerpt?: FieldPolicy<any> | FieldReadFunction<any>,
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	hue?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	importanceRatings?: FieldPolicy<any> | FieldReadFunction<any>,
	number?: FieldPolicy<any> | FieldReadFunction<any>,
	object?: FieldPolicy<any> | FieldReadFunction<any>,
	objectText?: FieldPolicy<any> | FieldReadFunction<any>,
	outgoingRelations?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCard?: FieldPolicy<any> | FieldReadFunction<any>
};
export type HistoryKeySpecifier = ('dateCreated' | HistoryKeySpecifier)[];
export type HistoryFieldPolicy = {
	dateCreated?: FieldPolicy<any> | FieldReadFunction<any>
};
export type ImportanceRatingKeySpecifier = ('day' | 'value' | ImportanceRatingKeySpecifier)[];
export type ImportanceRatingFieldPolicy = {
	day?: FieldPolicy<any> | FieldReadFunction<any>,
	value?: FieldPolicy<any> | FieldReadFunction<any>
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
export type QueryKeySpecifier = ('arc' | 'arcEntries' | 'arcEntry' | 'arcs' | 'comment' | 'commentEntries' | 'commentEntry' | 'comments' | 'commentsForDay' | 'day' | 'entries' | 'entry' | 'entryKeys' | 'highlight' | 'highlights' | 'journalEntries' | 'journalEntry' | 'journalEntryDates' | 'journalEntryKeys' | 'journalId' | 'journalMetadata' | 'journalTitle' | 'recentEntries' | 'recentJournalEntries' | 'relation' | 'relations' | 'searchArcsByName' | 'searchHighlights' | 'srsCard' | 'srsCards' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	arc?: FieldPolicy<any> | FieldReadFunction<any>,
	arcEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	arcEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	arcs?: FieldPolicy<any> | FieldReadFunction<any>,
	comment?: FieldPolicy<any> | FieldReadFunction<any>,
	commentEntries?: FieldPolicy<any> | FieldReadFunction<any>,
	commentEntry?: FieldPolicy<any> | FieldReadFunction<any>,
	comments?: FieldPolicy<any> | FieldReadFunction<any>,
	commentsForDay?: FieldPolicy<any> | FieldReadFunction<any>,
	day?: FieldPolicy<any> | FieldReadFunction<any>,
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
	searchArcsByName?: FieldPolicy<any> | FieldReadFunction<any>,
	searchHighlights?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCard?: FieldPolicy<any> | FieldReadFunction<any>,
	srsCards?: FieldPolicy<any> | FieldReadFunction<any>
};
export type RelationKeySpecifier = ('id' | 'object' | 'predicate' | 'subject' | RelationKeySpecifier)[];
export type RelationFieldPolicy = {
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	object?: FieldPolicy<any> | FieldReadFunction<any>,
	predicate?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SRSCardKeySpecifier = ('history' | 'id' | 'reviews' | 'subject' | 'upForReview' | SRSCardKeySpecifier)[];
export type SRSCardFieldPolicy = {
	history?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	reviews?: FieldPolicy<any> | FieldReadFunction<any>,
	subject?: FieldPolicy<any> | FieldReadFunction<any>,
	upForReview?: FieldPolicy<any> | FieldReadFunction<any>
};
export type SRSCardReviewKeySpecifier = ('day' | 'easeAfter' | 'easeBefore' | 'intervalAfter' | 'intervalBefore' | 'rating' | SRSCardReviewKeySpecifier)[];
export type SRSCardReviewFieldPolicy = {
	day?: FieldPolicy<any> | FieldReadFunction<any>,
	easeAfter?: FieldPolicy<any> | FieldReadFunction<any>,
	easeBefore?: FieldPolicy<any> | FieldReadFunction<any>,
	intervalAfter?: FieldPolicy<any> | FieldReadFunction<any>,
	intervalBefore?: FieldPolicy<any> | FieldReadFunction<any>,
	rating?: FieldPolicy<any> | FieldReadFunction<any>
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
	ImportanceRating?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | ImportanceRatingKeySpecifier | (() => undefined | ImportanceRatingKeySpecifier),
		fields?: ImportanceRatingFieldPolicy,
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
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;