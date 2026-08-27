import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { opportunityQuerySchema, createOpportunitySchema, updateOpportunitySchema } from "@/lib/validators";
import { z } from "zod";

type OpportunityQuery = z.infer<typeof opportunityQuerySchema>;
type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;

export const OpportunityService = {
  async getOpportunities(query: OpportunityQuery) {
    const { page, limit, search, type, experienceLevel, remote, location, skill, deadline, sort } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.OpportunityWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { requiredSkills: { hasSome: [search] } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (type) {
      where.type = type;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    if (remote !== undefined) {
      where.remote = remote;
    }

    if (location) {
      if (remote) {
        where.OR = (where.OR || []).concat([
          { location: { contains: location, mode: "insensitive" } },
          { remote: true }
        ]);
      } else {
        where.location = { contains: location, mode: "insensitive" };
      }
    }

    if (skill) {
      // Find where requiredSkills OR tags contain the skill
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : []),
        {
          OR: [
            { requiredSkills: { hasSome: [skill] } },
            { tags: { hasSome: [skill] } },
          ]
        }
      ];
    }

    if (deadline === "upcoming") {
      where.deadline = { gte: new Date() };
    }

    let orderBy: Prisma.OpportunityOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "oldest") {
      orderBy = { createdAt: "asc" };
    } else if (sort === "deadline") {
      orderBy = { deadline: "asc" }; // upcoming first
    }

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.opportunity.count({ where }),
    ]);

    return {
      opportunities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getOpportunityById(id: string) {
    return prisma.opportunity.findUnique({
      where: { id },
    });
  },

  async createOpportunity(data: CreateOpportunityInput) {
    return prisma.opportunity.create({
      data,
    });
  },

  async updateOpportunity(id: string, data: UpdateOpportunityInput) {
    return prisma.opportunity.update({
      where: { id },
      data,
    });
  },

  async deleteOpportunity(id: string) {
    return prisma.opportunity.delete({
      where: { id },
    });
  },
};
