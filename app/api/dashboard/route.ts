import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { User } from "@/lib/types";
import { withAuth } from "@/lib/middleware/withAuth";

export async function GET(request: NextRequest) {
  return withAuth(request, async (user: User) => {
    try {
      const userId = user.id;
      
      // Get date filters from query params
      const searchParams = request.nextUrl.searchParams;
      const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null;
      const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null;

      // Base where clause for date filtering
      const dateFilter = {
        ...(startDate && { gte: startDate }),
        ...(endDate && { lte: endDate }),
      };

      // Get total counts with date filter
      const totalClients = await prisma.client.count({
        where: { 
          userId,
          createdAt: dateFilter,
        },
      });

      const totalProjects = await prisma.project.count({
        where: { 
          userId,
          createdAt: dateFilter,
        },
      });

      const totalLogs = await prisma.interactionLog.count({
        where: { 
          userId,
          date: dateFilter,
        },
      });

      const totalReminders = await prisma.reminder.count({
        where: { 
          userId,
          createdAt: dateFilter,
        },
      });

      // Get logs by type with date filter
      const logsByType = await prisma.interactionLog.groupBy({
        by: ["type"],
        where: { 
          userId,
          date: dateFilter,
        },
        _count: true,
      });

      // Get upcoming reminders with date filter
      const upcomingReminders = await prisma.reminder.findMany({
        where: {
          userId,
          dueDate: {
            gte: new Date(),
            ...(endDate && { lte: endDate }),
          },
          status: "Pending",
          createdAt: dateFilter,
        },
        include: {
          client: true,
          project: true,
        },
        orderBy: {
          dueDate: "asc",
        },
      });

      // Get pending reminders with date filter
      const pendingReminders = await prisma.reminder.findMany({
        where: {
          userId,
          status: "Pending",
          createdAt: dateFilter,
        },
        include: {
          client: true,
          project: true,
        },
        orderBy: {
          dueDate: "asc",
        },
      });

      // Get overdue reminders with date filter
      const overdueReminders = await prisma.reminder.findMany({
        where: {
          userId,
          dueDate: {
            lt: new Date(),
          },
          status: "Pending",
          createdAt: dateFilter,
        },
        include: {
          client: true,
          project: true,
        },
        orderBy: {
          dueDate: "asc",
        },
      });

      // Get 5 most recent clients with date filter
      const recentClients = await prisma.client.findMany({
        where: { 
          userId,
          createdAt: dateFilter,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          projects: true,
          reminders: true,
          logs: true,
        },
      });

      // Get 5 most recent projects with date filter
      const recentProjects = await prisma.project.findMany({
        where: { 
          userId,
          createdAt: dateFilter,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          client: true,
          logs: true,
          reminders: true,
        },
      });

      // Get overdue projects with date filter
      const overdueProjects = await prisma.project.findMany({
        where: {
          userId,
          deadline: {
            lt: new Date(),
          },
          status: {
            notIn: ["Completed", "Canceled"],
          },
          createdAt: dateFilter,
        },
        include: {
          client: true,
        },
        orderBy: {
          deadline: "asc",
        },
      });

      // Get projects by status with date filter
      const projectsByStatus = await prisma.project.groupBy({
        by: ["status"],
        where: { 
          userId,
          createdAt: dateFilter,
        },
        _count: true,
      });

      // Get total budget with date filter
      const totalBudget = await prisma.project.aggregate({
        where: { 
          userId,
          createdAt: dateFilter,
        },
        _sum: {
          budget: true,
        },
      });

      // Get clients with highest total project budgets with date filter
      const topBudgetClients = await prisma.project.groupBy({
        by: ["clientId"],
        where: { 
          userId,
          createdAt: dateFilter,
        },
        _sum: {
          budget: true,
        },
        _count: true,
        orderBy: {
          _sum: {
            budget: "desc",
          },
        },
        take: 5,
      });

      const topBudgetClientsWithDetails = await Promise.all(
        topBudgetClients.map(async (project) => {
          const client = await prisma.client.findUnique({
            where: { id: project.clientId },
          });
          return {
            ...client,
            _count: project._count,
            _sum: project._sum,
          };
        })
      );

      // Get clients with most projects with date filter
      const topCountProjectsClients = await prisma.project.groupBy({
        by: ["clientId"],
        where: { 
          userId,
          createdAt: dateFilter,
        },
        _sum: {
          budget: true,
        },
        _count: true,
        orderBy: {
          _count: {
            clientId: "desc",
          },
        },
        take: 5,
      });

      const topCountProjectsClientsWithDetails = await Promise.all(
        topCountProjectsClients.map(async (project) => {
          const client = await prisma.client.findUnique({
            where: { id: project.clientId },
          });
          return {
            ...client,
            _count: project._count,
            _sum: project._sum,
          };
        })
      );

      // Get most recently added project with date filter
      const latestProject = await prisma.project.findFirst({
        where: { 
          userId,
          createdAt: dateFilter,
        },
        orderBy: { createdAt: "desc" },
        include: {
          client: true,
        },
      });

      // Get recent interaction logs with date filter
      const recentLogs = await prisma.interactionLog.findMany({
        where: { 
          userId,
          date: dateFilter,
        },
        orderBy: { date: "desc" },
        take: 5,
        include: {
          client: true,
          project: true,
        },
      });

      // Get all reminders with date filter
      const allReminders = await prisma.reminder.findMany({
        where: {
          userId,
          createdAt: dateFilter,
        },
      });

      return NextResponse.json({
        totalClients,
        totalProjects,
        totalLogs,
        totalReminders,
        totalBudget: totalBudget._sum.budget || 0,
        recentClients,
        recentProjects,
        overdueProjects,
        projectsByStatus,
        topBudgetClients: topBudgetClientsWithDetails,
        topCountProjectsClients: topCountProjectsClientsWithDetails,
        latestProject,
        recentLogs,
        logsByType,
        upcomingReminders,
        pendingReminders,
        overdueReminders,
        allReminders,
        // Include the date range used for filtering
        dateRange: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
      });
    } catch (error) {
      console.error("[DASHBOARD_GET]", error);
      return new NextResponse(error as string, { status: 500 });
    }
  });
}
