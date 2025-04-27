import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Freelance CRM API Documentation",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "token"
          }
        },
        schemas: {
          Client: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              name: {
                type: "string"
              },
              email: {
                type: "string",
                format: "email"
              },
              phone: {
                type: "string"
              },
              company: {
                type: "string",
                nullable: true
              },
              notes: {
                type: "string",
                nullable: true
              },
              userId: {
                type: "string"
              },
              createdAt: {
                type: "string",
                format: "date-time"
              },
              updatedAt: {
                type: "string",
                format: "date-time"
              }
            }
          },
          Project: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              title: {
                type: "string"
              },
              description: {
                type: "string",
                nullable: true
              },
              budget: {
                type: "number"
              },
              startDate: {
                type: "string",
                format: "date-time",
                nullable: true
              },
              deadline: {
                type: "string",
                format: "date-time"
              },
              status: {
                type: "string",
                enum: ["Pending", "In Progress", "Completed", "Cancelled"]
              },
              clientId: {
                type: "string"
              },
              userId: {
                type: "string"
              },
              createdAt: {
                type: "string",
                format: "date-time"
              },
              updatedAt: {
                type: "string",
                format: "date-time"
              }
            }
          },
          Reminder: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              title: {
                type: "string"
              },
              notes: {
                type: "string",
                nullable: true
              },
              dueDate: {
                type: "string",
                format: "date-time"
              },
              status: {
                type: "string",
                enum: ["Pending", "Completed"]
              },
              clientId: {
                type: "string",
                nullable: true
              },
              projectId: {
                type: "string",
                nullable: true
              },
              userId: {
                type: "string"
              },
              createdAt: {
                type: "string",
                format: "date-time"
              },
              updatedAt: {
                type: "string",
                format: "date-time"
              }
            }
          },
          InteractionLog: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid"
              },
              type: {
                type: "string",
                enum: ["call", "meeting", "email"]
              },
              notes: {
                type: "string"
              },
              date: {
                type: "string",
                format: "date-time"
              },
              clientId: {
                type: "string",
                nullable: true
              },
              projectId: {
                type: "string",
                nullable: true
              },
              userId: {
                type: "string"
              },
              createdAt: {
                type: "string",
                format: "date-time"
              },
              updatedAt: {
                type: "string",
                format: "date-time"
              }
            }
          }
        }
      },
      security: [],
    },
  });
  return spec;
};
