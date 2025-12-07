import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { z } from 'zod';
import axios from 'axios';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

// -------------------- Create MCP Server --------------------
const server = new McpServer({
    name: 'GHL_MCP_Server',
    version: '1.0.0'
});

// -------------------- Register add_contact tool --------------------
const AddContactSchema = z.object({
    apiKey: z.string().min(1, "API key is required"),
    locationId: z.string().min(1, "Location ID is required"),
    contact: z.object({
        name: z.string().min(1, "Contact name is required"),
        email: z.string().email("Valid email is required").optional().or(z.literal("")),
        phone: z.string().optional(),
        company: z.string().optional(),
        website: z.string().optional(),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            postalCode: z.string().optional(),
            country: z.string().optional()
        }).optional()
    })
});

type AddContactInput = z.infer<typeof AddContactSchema>;

server.registerTool(
    'add_contact',
    {
        title: 'Add Contact to GHL',
        description: 'Adds a new contact to GoHighLevel CRM using the provided API key and location ID',
        inputSchema: AddContactSchema,
        outputSchema: z.object({
            success: z.boolean(),
            contactId: z.string().optional(),
            message: z.string(),
            error: z.string().optional()
        })
    },
    async (input: AddContactInput) => {
        const { apiKey, locationId, contact } = input;

        try {
            // Prepare payload for GHL API
            const payload: Record<string, any> = {
                locationId,
                name: contact.name,
            };

            // Add optional fields if they exist
            if (contact.email) payload.email = contact.email;
            if (contact.phone) payload.phone = contact.phone;
            if (contact.company) payload.company = contact.company;
            if (contact.website) payload.website = contact.website;
            
            // Add address if provided
            if (contact.address) {
                const addressFields = [
                    'street', 'city', 'state', 'postalCode', 'country'
                ];
                addressFields.forEach(field => {
                    if (contact.address[field]) {
                        payload[field] = contact.address[field];
                    }
                });
            }

            // Make API request to GHL
            const response = await axios.post(
                'https://rest.gohighlevel.com/v1/contacts/',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    validateStatus: () => true
                }
            );

            // Handle response
            if (response.status >= 200 && response.status < 300) {
                const contactId = response.data.contact?.id || 'unknown';
                return {
                    content: [{ 
                        type: 'text', 
                        text: `Contact added successfully with ID: ${contactId}` 
                    }],
                    structuredContent: {
                        success: true,
                        contactId,
                        message: 'Contact added successfully'
                    }
                };
            } else {
                // Handle API error response
                const errorMsg = response.data?.message || 'Unknown error from GHL API';
                return {
                    content: [{ 
                        type: 'text', 
                        text: `Error adding contact: ${errorMsg}` 
                    }],
                    structuredContent: {
                        success: false,
                        message: 'Failed to add contact',
                        error: errorMsg
                    }
                };
            }
        } catch (error: any) {
            console.error('Error adding contact to GHL:', error);
            
            // Handle different error types
            let errorMessage = 'Unknown error occurred';
            if (error.response) {
                // API responded with error status
                errorMessage = error.response.data?.message || 
                               `GHL API error: ${error.response.status}`;
            } else if (error.request) {
                // No response received
                errorMessage = 'No response from GHL API';
            } else {
                // Request setup error
                errorMessage = error.message;
            }
            
            return {
                content: [{ 
                    type: 'text', 
                    text: `Error: ${errorMessage}` 
                }],
                structuredContent: {
                    success: false,
                    message: 'Failed to add contact',
                    error: errorMessage
                }
            };
        }
    }
);

// -------------------- Express setup --------------------
const app = express();
app.use(express.json());

// MCP endpoint
app.post('/mcp', async (req, res) => {
    console.log("MCP endpoint accessed");
    
    // Create a new transport for each request
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    // Handle connection close
    res.on('close', () => {
        transport.close();
    });

    // Connect server to transport and handle request
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

// Health check endpoint
app.get('/', async (req, res) => {
    res.status(200).json({ 
        message: 'GHL MCP Server is running',
        version: '1.0.0',
        endpoints: {
            mcp: '/mcp',
            health: '/'
        }
    });
});

// -------------------- Start server --------------------
const port = parseInt(process.env.PORT || '3001');
app.listen(port, () => {
    console.log(`GHL MCP Server running on http://localhost:${port}/mcp`);
}).on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
});