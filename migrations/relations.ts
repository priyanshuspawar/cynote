import { relations } from "drizzle-orm/relations";
import { users, tags, folders, files, workspaces, collaborators, products, prices, subscriptions, usersInAuth, fileTags } from "./schema";

export const tagsRelations = relations(tags, ({one, many}) => ({
	user: one(users, {
		fields: [tags.createdBy],
		references: [users.id]
	}),
	fileTags: many(fileTags),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	tags: many(tags),
	collaborators: many(collaborators),
	usersInAuth: one(usersInAuth, {
		fields: [users.id],
		references: [usersInAuth.id]
	}),
}));

export const filesRelations = relations(files, ({one, many}) => ({
	folder: one(folders, {
		fields: [files.folderId],
		references: [folders.id]
	}),
	workspace: one(workspaces, {
		fields: [files.workspaceId],
		references: [workspaces.id]
	}),
	fileTags: many(fileTags),
}));

export const foldersRelations = relations(folders, ({one, many}) => ({
	files: many(files),
	workspace: one(workspaces, {
		fields: [folders.workspaceId],
		references: [workspaces.id]
	}),
}));

export const workspacesRelations = relations(workspaces, ({many}) => ({
	files: many(files),
	folders: many(folders),
	collaborators: many(collaborators),
}));

export const collaboratorsRelations = relations(collaborators, ({one}) => ({
	user: one(users, {
		fields: [collaborators.userId],
		references: [users.id]
	}),
	workspace: one(workspaces, {
		fields: [collaborators.workspaceId],
		references: [workspaces.id]
	}),
}));

export const pricesRelations = relations(prices, ({one, many}) => ({
	product: one(products, {
		fields: [prices.productId],
		references: [products.id]
	}),
	subscriptions: many(subscriptions),
}));

export const productsRelations = relations(products, ({many}) => ({
	prices: many(prices),
}));

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
	price: one(prices, {
		fields: [subscriptions.priceId],
		references: [prices.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	users: many(users),
}));

export const fileTagsRelations = relations(fileTags, ({one}) => ({
	file: one(files, {
		fields: [fileTags.fileId],
		references: [files.id]
	}),
	tag: one(tags, {
		fields: [fileTags.tagId],
		references: [tags.id]
	}),
}));