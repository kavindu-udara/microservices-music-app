import { prisma } from "@packages/shared/prisma";
import { createTrackSchema } from "@packages/shared/schema";
import { uploadTrack } from "@packages/shared/upload-track";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateTrackRequestBody = {
	title: string;
	albumId?: number | null;
	duration: number;
	audioUrl: string;
	language: string;
	isExplicit?: boolean;
	isPublished?: boolean;
	artistIds: number[];
	genreIds?: number[];
};


export const createTrack = async (
	request: FastifyRequest<{ Body: CreateTrackRequestBody }>,
	reply: FastifyReply,
) => {
	try {

	} catch (error) {
	}
};
