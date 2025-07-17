import { pgTable, uuid, text, foreignKey, unique, timestamp, boolean, jsonb, bigint, integer, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const aalLevel = pgEnum("aal_level", ['aal3', 'aal2', 'aal1'])
export const action = pgEnum("action", ['ERROR', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['plain', 's256'])
export const equalityOp = pgEnum("equality_op", ['in', 'gte', 'gt', 'lte', 'lt', 'neq', 'eq'])
export const factorStatus = pgEnum("factor_status", ['verified', 'unverified'])
export const factorType = pgEnum("factor_type", ['webauthn', 'totp'])
export const keyStatus = pgEnum("key_status", ['expired', 'invalid', 'valid', 'default'])
export const keyType = pgEnum("key_type", ['stream_xchacha20', 'secretstream', 'secretbox', 'kdf', 'generichash', 'shorthash', 'auth', 'hmacsha256', 'hmacsha512', 'aead-det', 'aead-ietf'])
export const pricingPlanInterval = pgEnum("pricing_plan_interval", ['year', 'month', 'week', 'day'])
export const pricingType = pgEnum("pricing_type", ['recurring', 'one_time'])
export const subscriptionStatus = pgEnum("subscription_status", ['trialing', 'active', 'canceled', 'unpaid', 'past_due', 'incomplete_expired', 'incomplete'])


export const customers = pgTable("customers", {
	id: uuid().primaryKey().notNull(),
	stripeCustomerId: text("stripe_customer_id"),
});

export const tags = pgTable("tags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	color: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "tags_created_by_users_id_fk"
		}),
	unique("tags_name_unique").on(table.name),
]);

export const files = pgTable("files", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	iconId: text("icon_id").notNull(),
	data: text(),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").notNull(),
	folderId: uuid("folder_id").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id],
			name: "files_folder_id_folders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "files_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
]);

export const folders = pgTable("folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	title: text().notNull(),
	iconId: text("icon_id").notNull(),
	data: text(),
	inTrash: text("in_trash"),
	bannerUrl: text("banner_url"),
	workspaceId: uuid("workspace_id").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "folders_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
]);

export const collaborators = pgTable("collaborators", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	workspaceId: uuid("workspace_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "collaborators_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "collaborators_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
]);

export const workspaces = pgTable("workspaces", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	workspaceOwner: uuid("workspace_owner").notNull(),
	title: text().notNull(),
	iconId: text("icon_id").notNull(),
	data: text(),
	inTrash: text("in_trash"),
	logo: text(),
	bannerUrl: text("banner_url"),
	isShared: boolean().default(false).notNull(),
});

export const products = pgTable("products", {
	id: text().primaryKey().notNull(),
	active: boolean(),
	name: text(),
	description: text(),
	image: text(),
	metadata: jsonb(),
});

export const prices = pgTable("prices", {
	id: text().primaryKey().notNull(),
	productId: text("product_id"),
	active: boolean(),
	description: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	unitAmount: bigint("unit_amount", { mode: "number" }),
	currency: text(),
	type: pricingType(),
	interval: pricingPlanInterval(),
	intervalCount: integer("interval_count"),
	trialPeriodDays: integer("trial_period_days"),
	metadata: jsonb(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "prices_product_id_products_id_fk"
		}),
]);

export const subscriptions = pgTable("subscriptions", {
	id: text().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	status: subscriptionStatus(),
	metadata: jsonb(),
	priceId: text("price_id"),
	quantity: integer(),
	cancelAtPeriodEnd: boolean("cancel_at_period_end"),
	created: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	currentPeriodStart: timestamp("current_period_start", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	currentPeriodEnd: timestamp("current_period_end", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	endedAt: timestamp("ended_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	cancelAt: timestamp("cancel_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	canceledAt: timestamp("canceled_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	trialStart: timestamp("trial_start", { withTimezone: true, mode: 'string' }).defaultNow(),
	trialEnd: timestamp("trial_end", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.priceId],
			foreignColumns: [prices.id],
			name: "subscriptions_price_id_prices_id_fk"
		}),
]);

export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	billingAddress: jsonb("billing_address"),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	paymentMethod: jsonb("payment_method"),
	email: text(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_fkey"
		}).onDelete("cascade"),
]);

export const fileTags = pgTable("file_tags", {
	fileId: uuid("file_id").notNull(),
	tagId: uuid("tag_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.fileId],
			foreignColumns: [files.id],
			name: "file_tags_file_id_files_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "file_tags_tag_id_tags_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.fileId, table.tagId], name: "file_tags_file_id_tag_id_pk"}),
]);
