import { prisma } from "@packages/shared/prisma";

import { uploadTrack } from "@packages/shared/upload-track";
import { FastifyReply, FastifyRequest } from "fastify";

type CreateTrackRequestBody = {
  title: string;
  albumId?: string | number | null;
  language: string;
  isExplicit?: boolean | string;
  isPublished?: boolean | string;
  artistIds: string | string[] | number | number[];
  genreIds?: string | string[] | number | number[];
  file : File;
};

type TrackUploadFile = {
  filename: string;
  mimetype: string;
  toBuffer: () => Promise<Buffer>;
};

const toOptionalNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const toBoolean = (value: unknown) => value === true || value === "true";

const toNumberArray = (value: unknown) => {
  if (value === undefined || value === null || value === "") {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values
    .map((item) => Number(item))
    .filter((item) => !Number.isNaN(item));
};

export const createTrack = async (
  request: FastifyRequest<{ Body: CreateTrackRequestBody }>,
  reply: FastifyReply,
) => {
  try {
    if (!request.isMultipart()) {
      return reply
        .code(400)
        .send({ error: "Request must be multipart/form-data" });
    }

	console.log("Received multipart fields:", request.body);
   
    if (!request.body.file) {
      return reply.code(400).send({ error: "No file uploaded" });
    }

	const { title, albumId, language, isExplicit, isPublished, artistIds, genreIds } = request.body;

	const uploadedFile = request.body.file as unknown as TrackUploadFile;

    const uploadedTrack = await uploadTrack({
      fileBuffer: await uploadedFile.toBuffer(),
      fileName: uploadedFile.filename,
      contentType: uploadedFile.mimetype,
    });

    const newTrack = await prisma.track.create({
      data: {
        title,
        audioUrl: uploadedTrack.audioUrl,
        language,
        isExplicit : isExplicit == 'true',
        isPublished : isPublished == 'true',
        TrackHasArtist: {
          create: artistIds.map((artistId) => ({ artistId })),
        },
        TrackHasGenre: {
          create: genreIds.map((genreId) => ({ genreId })),
        },
        ...(albumId !== undefined
          ? {
              Album: {
                connect: {
                  id: albumId,
                },
              },
            }
          : {}),
      },
      include: {
        TrackHasArtist: true,
        TrackHasGenre: true,
      },
    });

    return reply.code(201).send(newTrack);
  } catch (error) {
    console.error("Error in create tack:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    reply
      .code(500)
      .send({ error: "Internal Server Error", message });
  }
};

export const testUpload = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
	if (!request.isMultipart()) {
	  return reply
		.code(400)
		.send({ error: "Request must be multipart/form-data" });
	}

	console.log("Received multipart fields:", request.body);

	const multipartFields: Record<string, unknown> = {};	

	for await (const part of request.parts()) {
	  if (part.type === "file") {
		continue;
	  }

	  multipartFields[part.fieldname] = part.value;
	}

	console.log("Received multipart fields:", multipartFields);

	return reply.code(200).send({ fields: multipartFields });
  } catch (error) {
	console.error("Error in test upload:", error);
	const message = error instanceof Error ? error.message : "Internal Server Error";
	reply
	  .code(500)
	  .send({ error: "Internal Server Error", message });
  }
}
